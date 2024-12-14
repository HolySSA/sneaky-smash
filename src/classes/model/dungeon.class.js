import MonsterLogic from './monsterLogic.class.js';
import logger from '../../utils/logger.js';
import { removeDungeonSession } from '../../sessions/dungeon.session.js';
import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import { enqueueSend } from '../../utils/socket/messageQueue.js';
import { getGameAssets } from '../../init/loadAsset.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getUserById } from '../../sessions/user.session.js';
import { setSessionId } from '../../sessions/redis/redis.user.js';

class Dungeon {
  constructor(dungeonInfo) {
    this.dungeonId = dungeonInfo.dungeonId;
    this.name = dungeonInfo.name;
    this.users = new Map();
    this.usersUUID = [];
    this.monsterLogic = new MonsterLogic(this);

    this.nexusCurrentHp = 100;
    this.nexusMaxHp = 100;
  }

  async addDungeonUser(user) {
    const userId = user.socket.id;
    user.dungeonId = this.dungeonId;
    await setSessionId(userId, this.dungeonId);
    if (this.users.has(userId)) {
      throw new Error('이미 던전에 참여 중인 유저입니다.');
    }

    this.usersUUID.push(user.socket.UUID);
    const statsInfo = this.getStatsByUserId(userId);

    const dungeonUser = {
      user: user,
      statsInfo,
      monsterKillCount: 0,
      userKillCount: 0,
    };

    this.users.set(userId, dungeonUser);

    return user;
  }

  increaseMonsterKillCount(userId) {
    const user = this.users.get(userId);
    if (!user) {
      logger.error(`해당 userId (${userId})를 가진 사용자가 던전에 없습니다.`);
      return;
    }
    user.monsterKillCount += 1;
    logger.info(
      `플레이어 ${userId}의 몬스터 킬 수가 증가했습니다. 현재 몬스터 킬 수: ${user.monsterKillCount}`,
    );

    createNotificationPacket(
      PACKET_ID.S_MonsterKillCount,
      { playerId: userId, monsterKillCount: user.monsterKillCount },
      this.getDungeonUsersUUID(),
    );
  }

  increaseUserKillCount(userId) {
    const user = this.users.get(userId);
    if (!user) {
      logger.error(`해당 userId (${userId})를 가진 사용자가 던전에 없습니다.`);
      return;
    }
    user.userKillCount += 1;
    logger.info(
      `플레이어 ${userId}의 유저 킬 수가 증가했습니다. 현재 유저 킬 수: ${user.userKillCount}`,
    );

    createNotificationPacket(
      PACKET_ID.S_PlayerKillCount,
      { playerId: userId, playerKillCount: user.userKillCount },
      this.getDungeonUsersUUID(),
    );
  }

  async removeDungeonUser(userId) {
    const dungeonUser = this.users.get(userId);
    if (dungeonUser) {
      const user = dungeonUser.user;
      const userUUID = user.socket.UUID;
      user.dungeonId = '';
      const result = this.users.delete(userId);
      await setSessionId(userId, '');
      const index = this.usersUUID.indexOf((uuid) => uuid === userUUID);
      if (index !== -1) {
        this.usersUUID.splice(index, 1);
      }

      if (this.users.size == 0) {
        this.Dispose();
      }

      return result;
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      const userLatency = user.userInfo.getLatency();
      maxLatency = Math.max(maxLatency, userLatency);
    });

    return maxLatency;
  }

  callOnClose() {
    if (this.users.size === 0) {
      this.monsterLogic.pathServer.onClose();
    }
  }

  isRemainedUser() {
    if (this.users.size === 0) {
      this.removeDungeonSession();
      return true;
    }
    return false;
  }

  removeDungeonSession() {
    removeDungeonSession(this.dungeonId);
  }

  getDungeonUser(userId) {
    return this.users.get(userId);
  }

  getDungeonUsersUUID() {
    if (!this.users || this.users.size === 0) {
      logger.info(`던전에 유저가 존재하지 않습니다. dungeonId: ${this.dungeonId}`);
      return null;
    }

    return Array.from(this.users.values()).map((user) => user.user.socket.UUID);
  }

  // 인포만 매핑해서 받기
  getAllUsers() {
    const users = new Map();
    this.users.forEach((user, userId) => {
      users.set(userId, {
        socket: user.userInfo.socket, // 소켓 객체
        transform: user.userInfo.transform, // 위치 및 회전 정보
        skillList: user.userInfo.skillList || [], // 스킬 리스트
        currentHp: user.currentHp, // 현재 체력
        statsInfo: user.statsInfo,
      });
    });
    return users;
  }

  getUserStats(userId) {
    const user = this.getDungeonUser(userId);
    return user.statsInfo;
  }

  setUserStats(userId) {
    const user = this.users.get(userId);

    // 레벨 퍼당 스탯을 가져와서 @@@@@@@@@@@@@@ 밑에 스탯에 추가 해주면 됨.

    user.statsInfo = {
      stats: {
        level: user.statsInfo.stats.level + 1,
        maxHp: user.statsInfo.stats.maxHp + 20,
        atk: user.statsInfo.stats.atk + 3,
        def: user.statsInfo.stats.def + 1,
        moveSpeed: user.statsInfo.stats.moveSpeed + 1,
        criticalProbability: user.statsInfo.stats.criticalProbability,
        criticalDamageRate: user.statsInfo.stats.criticalDamageRate,
      },
      exp: user.statsInfo.exp,
    };

    return user.statsInfo;
  }

  getStatsByUserId = (userId) => {
    const userInfo = getUserById(userId);
    const classAssets = getGameAssets().classInfo; // 맵핑된 클래스 데이터 가져오기
    const classInfos = classAssets[userInfo.myClass]; // ID로 직접 접근

    if (!classInfos) {
      logger.error(`Class 정보를 찾을 수 없습니다. classId: ${userInfo.myClass}`);
    }

    const expAssets = getGameAssets().expInfo; // 맵핑된 경험치 데이터 가져오기
    const expInfos = expAssets[1]; // 레벨 1의 경험치 정보 접근

    if (!expInfos) {
      logger.error('레벨 1의 경험치 정보를 찾을 수 없습니다.');
    }

    return {
      Level: 1,
      stats: classInfos.stats,
      exp: 0,
      maxExp: expInfos.maxExp,
    };
  };

  addExp(userId, getExp) {
    const user = this.getDungeonUser(userId);

    // 레벨당 필요 경험치 불러오기
    let maxExp = user.statsInfo.maxExp;

    if (maxExp === 0) {
      const expAssets = getGameAssets().expInfo;
      maxExp = expAssets[user.statsInfo.level].maxExp; // ID로 직접 접근
    }

    user.statsInfo.exp += getExp;
    logger.info(`플레이어 ${userId}의 경험치 get +${getExp} 현재경험치 ${user.statsInfo.exp}`);

    const expResponse = createResponse(PACKET_ID.S_GetExp, {
      playerId: userId,
      expAmount: user.statsInfo.exp,
    });

    enqueueSend(user.user.UUID, expResponse);

    if (user.statsInfo.exp >= maxExp) {
      user.statsInfo.exp -= maxExp;
      this.levelUpNotification(userId);
    }

    return user.statsInfo.exp;
  }

  levelUpNotification(userId) {
    createNotificationPacket(
      PACKET_ID.S_LevelUp,
      { playerId: userId, statInfo: this.setUserStats(userId) },
      this.getDungeonUsersUUID(),
    );
  }

  getUserHp(userId) {
    const stats = this.getUserStats(userId);
    return stats.hp;
  }

  getCurrentStage() {
    return this.stages[this.currentStage];
  }

  nextStage() {
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
  }

  damagedUser(userId, damage) {
    const user = this.users.get(userId);

    // 방어 로직 있으면 여기다 추가
    user.statsInfo.stats.curHp -= damage;

    createNotificationPacket(
      PACKET_ID.S_HitPlayer,
      { playerId: userId, damage },
      this.getDungeonUsersUUID(),
    );

    return user.statsInfo.stats.curHp;
  }

  getAmountHpByKillUser(userId) {
    const user = this.users.get(userId);
    const userMaxHp = user.statsInfo.stats.maxHp;

    const healAmount = Math.floor(userMaxHp * 0.5);

    user.statsInfo.stats.curHp = Math.min(user.statsInfo.stats.curHp + healAmount, userMaxHp);

    createNotificationPacket(
      PACKET_ID.S_UpdatePlayerHp,
      { playerId: userId, hp: user.statsInfo.stats.curHp },
      this.getDungeonUsersUUID(),
    );
  }

  updatePlayerHp(userId, amount) {
    const user = this.users.get(userId);

    // 스탯 불러오기 수정
    const maxHp = user.statsInfo.stats.maxHp;
    const newHp = user.currentHp + amount;
    user.currentHp = Math.max(0, Math.min(newHp, maxHp));

    return user.currentHp;
  }

  increasePlayerAtk(userId, amount) {
    const user = this.users.get(userId);

    user.atk = Math.min(amount + user.atk, user.atk);

    return user.atk;
  }

  increasePlayerDef(userId, amount) {
    const user = this.users.get(userId);

    user.def = Math.min(amount + user.def, user.def);

    return user.def;
  }

  increasePlayerMaxHp(userId, amount) {
    const user = this.users.get(userId);

    user.maxHp = Math.min(amount + user.maxHp, user.maxHp);

    return user.maxHp;
  }

  increasePlayerMoveSpeed(userId, amount) {
    const user = this.users.get(userId);

    user.moveSpeed = Math.min(amount + user.moveSpeed, user.moveSpeed);

    return user.moveSpeed;
  }

  increasePlayerCriticalProbability(userId, amount) {
    const user = this.users.get(userId);

    user.criticalProbability = Math.min(amount + user.criticalProbability, user.criticalProbability);

    return user.criticalProbability;
  }
  increasePlayerCriticalDamageRate(userId, amount) {
    const user = this.users.get(userId);

    user.criticalDamageRate = Math.min(amount + user.criticalDamageRate, user.criticalDamageRate);

    return user.criticalDamageRate;
  }

  nexusDamaged(damage) {
    this.nexusCurrentHp -= damage;
    return this.nexusCurrentHp;
  }
  Dispose() {
    this.monsterLogic.Dispose();
    removeDungeonSession(this.dungeonId);
  }
}

export default Dungeon;
