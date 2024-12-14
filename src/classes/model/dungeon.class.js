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

  async addDungeonUser(user, statInfo) {
    const userId = user.socket.id;
    user.dungeonId = this.dungeonId;
    await setSessionId(userId, this.dungeonId);
    if (this.users.has(userId)) {
      throw new Error('이미 던전에 참여 중인 유저입니다.');
    }

    this.usersUUID.push(user.socket.UUID);

    const dungeonUser = {
      user,
      currentHp: statInfo.stats.maxHp,
      userKillCount: 0,
      monsterKillCount: 0,
      statInfo,
      skillList: [],
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
    return this.usersUUID;
  }

  getUserStats(userId) {
    const user = this.getDungeonUser(userId);
    return user.statInfo;
  }

  levelUpUserStats(userId) {
    const user = this.users.get(userId);
    const nextLevel = user.statInfo.level + 1;
    const expAssets = getGameAssets().expInfo; // 맵핑된 경험치 데이터 가져오기
    const expInfos = expAssets[nextLevel];
    const newExp = user.statInfo.exp - user.statInfo.maxExp;
    user.statInfo = {
      level: nextLevel,
      stats: {
        maxHp: user.statInfo.stats.maxHp + 20,
        atk: user.statInfo.stats.atk + 3,
        def: user.statInfo.stats.def + 1,
        moveSpeed: user.statInfo.stats.moveSpeed + 1,
        criticalProbability: user.statInfo.stats.criticalProbability,
        criticalDamageRate: user.statInfo.stats.criticalDamageRate,
      },
      exp: newExp,
      maxExp: expInfos.maxExp,
    };

    return user.statInfo;
  }

  addExp(userId, getExp) {
    const user = this.getDungeonUser(userId);

    // 레벨당 필요 경험치 불러오기
    let maxExp = user.statInfo.maxExp;

    if (!maxExp) {
      const expAssets = getGameAssets().expInfo;
      maxExp = expAssets[user.statInfo.level].maxExp; // ID로 직접 접근
    }

    user.statInfo.exp += getExp;
    //logger.info(`플레이어 ${userId}의 경험치 get +${getExp} 현재경험치 ${user.statInfo.exp}`);

    const expResponse = createResponse(PACKET_ID.S_GetExp, {
      playerId: userId,
      expAmount: user.statInfo.exp,
    });

    enqueueSend(user.user.UUID, expResponse);

    if (user.statInfo.exp >= maxExp) {
      this.levelUpNotification(userId);
    }

    return user.statInfo.exp;
  }

  levelUpNotification(userId) {
    createNotificationPacket(
      PACKET_ID.S_LevelUp,
      { playerId: userId, statInfo: this.levelUpUserStats(userId) },
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

    createNotificationPacket(
      PACKET_ID.S_HitPlayer,
      { playerId: userId, damage },
      this.getDungeonUsersUUID(),
    );

    return user.currentHp;
  }

  getAmountHpByKillUser(userId) {
    const user = this.users.get(userId);
    const userMaxHp = user.statInfo.stats.maxHp;

    const healAmount = Math.floor(userMaxHp * 0.5);

    user.currentHp = Math.min(user.currentHp + healAmount, userMaxHp);

    createNotificationPacket(
      PACKET_ID.S_UpdatePlayerHp,
      { playerId: userId, hp: user.currentHp },
      this.getDungeonUsersUUID(),
    );
  }

  updatePlayerHp(userId, amount) {
    const user = this.users.get(userId);

    // 스탯 불러오기 수정
    const maxHp = user.statInfo.stats.maxHp;
    const currentHp = user.currentHp;
    const newHp = currentHp + amount;
    user.currentHp = Math.max(0, Math.min(newHp, maxHp));

    if (user.currentHp != currentHp) {
      createNotificationPacket(
        PACKET_ID.S_UpdatePlayerHp,
        { playerId: userId, hp: user.currentHp },
        this.getDungeonUsersUUID(),
      );
    }

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

    user.criticalProbability = Math.min(
      amount + user.criticalProbability,
      user.criticalProbability,
    );

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
