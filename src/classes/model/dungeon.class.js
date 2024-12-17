import MonsterLogic from './monsterLogic.class.js';
import logger from '../../utils/logger.js';
import { removeDungeonSession } from '../../sessions/dungeon.session.js';
import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import { enqueueSend } from '../../utils/socket/messageQueue.js';
import { getGameAssets } from '../../init/loadAsset.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { setSessionId } from '../../sessions/redis/redis.user.js';
import Nexus from './nexus.class.js';
import { removeUserForTown } from '../../sessions/town.session.js';

class Dungeon {
  constructor(dungeonInfo, dungeonLevel) {
    this.dungeonId = dungeonInfo.dungeonId;
    this.dungeonLevel = dungeonLevel;
    this.dungeonLevelFactor = (dungeonLevel - 1) * 0.1;
    this.name = dungeonInfo.name;
    this.users = new Map();
    this.usersUUID = [];
    this.monsterLogic = new MonsterLogic(this);

    this.nexusCurrentHp = 100;
    this.nexusMaxHp = 100;

    this.nexus = null;
    this.respawnTimers = new Map();
    this.droppedItems = {};
    this.spawnTransforms = [
      [2.5, 0.5, 112, 180],
      [2.5, 0.5, -5.5, 0],
      [42, 0.5, 52.5, 270],
      [-38, 0.5, 52.5, 90],
    ];

    this.startTime = Date.now(); // 던전 시작 시간 초기화
  }

  async addDungeonUser(user, statInfo) {
    const userId = user.socket.id;
    user.dungeonId = this.dungeonId;
    removeUserForTown(userId);
    await setSessionId(userId, this.dungeonId);
    if (this.users.has(userId)) {
      logger.info('이미 던전에 참여 중인 유저입니다.');
      return null;
    }

    this.usersUUID.push(user.socket.UUID);

    const dungeonUser = {
      user,
      _currentHp: statInfo.stats.maxHp,
      get currentHp() {
        return this._currentHp;
      },
      set currentHp(value) {
        this._currentHp = Math.max(0, Math.min(value, statInfo.stats.maxHp));
      },
      userKillCount: 0,
      monsterKillCount: 0,
      statInfo,
      skillList: {}, //getSkill가보면     dungeonUser.skillList[skillId] = { slot: slotIndex, ...skillData, lastUseTime: 0 }; 이렇게 등록함
    };

    this.users.set(userId, dungeonUser);

    return user;
  }

  attackedNexus(damage, playerId) {
    if (this.nexus) {
      const isGameOver = this.nexus.hitNexus(damage, playerId, this.usersUUID);
      if (isGameOver) {
        logger.info(`Nexus destroyed in dungeon ${this.dungeonId}.`);
        return true; // 게임 종료
      }
    }
    return false;
  }

  handleGameEnd() {
    const playerId = this.nexus.lastAttackerId;
    logger.info(`Game ended in dungeonId ${this.dungeonId}. Winner is player: ${playerId}`);

    createNotificationPacket(PACKET_ID.S_GameEnd, { playerId }, this.usersUUID);
  }

  spawnNexusNotification() {
    this.nexus = new Nexus();

    if (this.nexus) {
      logger.info(
        `Nexus spawned in dungeon: ${this.dungeonId}, Position: ${JSON.stringify(this.nexus.position)}`,
      );

      this.nexus.spawnNexusNotification(this.usersUUID);

      this.nexus.updateNexusHpNotification(this.usersUUID);

      return true;
    }
    return false;
  }

  /**
   *  몬스터를 통해 드랍된 아이템 정보를 보관합니다.
   */
  createDroppedObject(playerId, Id, itemInstanceId) {
    if (!this.users.has(playerId)) {
      return;
    }

    this.droppedItems[itemInstanceId] = { playerId, Id };
  }

  /**
   * 몬스터를 통해 드랍되었던 아이템 정보를 가져오며 데이터를 제거합니다.
   * @param {Number} playerId
   * @param {Number} Id  ItemID or SkillID
   * @param {Number} itemInstanceId
   * @returns
   */
  getDroppedObject(playerId, Id, itemInstanceId) {
    const droppedItem = this.droppedItems[itemInstanceId];
    if (!droppedItem || droppedItem.playerId != playerId || droppedItem.Id != Id) {
      logger.error(`getItemOrSkill. not matched droppedItemInfo playerID: ${playerId} or Id ${Id}`);
      return;
    }
    delete this.droppedItems[itemInstanceId];
    return droppedItem;
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

  increaseUserKillCount(attackUserId) {
    const user = this.users.get(attackUserId);
    if (!user) {
      logger.error(`해당 userId (${attackUserId})를 가진 사용자가 던전에 없습니다.`);
      return;
    }
    user.userKillCount += 1;
    logger.info(
      `플레이어 ${attackUserId}의 유저 킬 수가 증가했습니다. 현재 유저 킬 수: ${user.userKillCount}`,
    );

    createNotificationPacket(
      PACKET_ID.S_PlayerKillCount,
      { playerId: attackUserId, playerKillCount: user.userKillCount },
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

      if (this.users.size == 1) {
        const lastUser = this.users.values().next().value;
        this.nexus.lastAttackerId = lastUser.user.id;
        this.handleGameEnd();
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

  removeDungeonSession() {
    removeDungeonSession(this.dungeonId);
  }

  getDungeonUser(userId) {
    return this.users.get(userId);
  }

  getDungeonUsersUUID() {
    return this.usersUUID;
  }

  getSpawnPosition() {
    return [...this.spawnTransforms];
  }

  getUserStats(userId) {
    const user = this.getDungeonUser(userId);
    return user.statInfo;
  }

  levelUpUserStats(user, nextLevel, maxExp) {
    const { stats: currentStats, exp: currentExp, maxExp: currentMaxExp } = user.statInfo;

    const newExp = currentExp - currentMaxExp;

    const levelperStats = getGameAssets().levelperStats;

    const userClassId = user.user.myClass;
    const classLevelStats = levelperStats[userClassId]?.stats || {};

    user.statInfo = {
      level: nextLevel,
      stats: {
        maxHp: currentStats.maxHp + (classLevelStats.maxHp || 0),
        atk: currentStats.atk + (classLevelStats.atk || 0),
        def: currentStats.def + (classLevelStats.def || 0),
        moveSpeed: currentStats.moveSpeed + (classLevelStats.speed || 0),
        criticalProbability:
          currentStats.criticalProbability + (classLevelStats.criticalProbability || 0),
        criticalDamageRate:
          currentStats.criticalDamageRate + (classLevelStats.criticalDamageRate || 0),
      },
      exp: newExp,
      maxExp,
    };

    this.updatePlayerHp(user.user.id, classLevelStats.maxHp);

    return user.statInfo;
  }

  addExp(userId, getExp) {
    const user = this.getDungeonUser(userId);
    // 레벨당 필요 경험치 불러오기
    let maxExp = user.statInfo.maxExp;
    const currentLevel = user.statInfo.level;
    const nextLevel = currentLevel + 1;
    const expAssets = getGameAssets().expInfo;

    if (!maxExp) {
      maxExp = expAssets[currentLevel].maxExp; // ID로 직접 접근
    }

    //에셋 정보가 없으면 테이블 문제 or 최대 레벨 도달
    if (!expAssets[nextLevel]) {
      return;
    }

    user.statInfo.exp += getExp;

    const expResponse = createResponse(PACKET_ID.S_GetExp, {
      playerId: userId,
      expAmount: user.statInfo.exp,
    });

    enqueueSend(user.user.socket.UUID, expResponse);

    if (user.statInfo.exp >= maxExp) {
      const statInfo = this.levelUpUserStats(user, nextLevel, expAssets[nextLevel].maxExp);
      this.levelUpNotification(userId, statInfo);
    }

    return user.statInfo.exp;
  }

  levelUpNotification(userId, statInfo) {
    createNotificationPacket(
      PACKET_ID.S_LevelUp,

      { playerId: userId, statInfo },
      this.getDungeonUsersUUID(),
    );
  }

  damagedUser(userId, damage) {
    const user = this.users.get(userId);
    const resultDamage = Math.max(1, Math.floor(damage * (100 - user.statInfo.stats.def) * 0.01)); // 방어력이 공격력보다 커도 최소뎀

    createNotificationPacket(
      PACKET_ID.S_HitPlayer,
      { playerId: userId, damage: resultDamage },
      this.getDungeonUsersUUID(),
    );

    return resultDamage;
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

  updatePlayerAtk(userId, amount) {
    const user = this.users.get(userId);

    user.statInfo.stats.atk = amount + user.statInfo.stats.atk;

    return user.statInfo.stats.atk;
  }

  updatePlayerDef(userId, amount) {
    const user = this.users.get(userId);

    user.statInfo.stats.def = amount + user.statInfo.stats.def;

    return user.statInfo.stats.def;
  }

  updatePlayerMaxHp(userId, amount) {
    const user = this.users.get(userId);
    user.statInfo.stats.maxHp = amount + user.statInfo.stats.maxHp;
    return user.statInfo.stats.maxHp;
  }

  updatePlayerMoveSpeed(userId, amount) {
    const user = this.users.get(userId);

    user.statInfo.stats.moveSpeed = amount + user.statInfo.stats.moveSpeed;

    return user.statInfo.stats.moveSpeed;
  }

  updatePlayerCriticalProbability(userId, amount) {
    const user = this.users.get(userId);

    user.statInfo.stats.criticalProbability = amount + user.statInfo.stats.criticalProbability;

    return user.criticalProbability;
  }

  updatePlayerCriticalDamageRate(userId, amount) {
    const user = this.users.get(userId);
    user.statInfo.stats.criticalDamageRate = amount + user.statInfo.stats.criticalDamageRate;
    return user.statInfo.stats.criticalDamageRate;
  }

  nexusDamaged(damage) {
    this.nexusCurrentHp -= damage;
    return this.nexusCurrentHp;
  }

  // int32 playerId = 1;
  // TransformInfo transform = 2;
  // StatInfo statInfo = 3;

  onRespawn = (userId) => {
    const user = this.users.get(userId);

    const getSpawnPos =
      this.spawnTransforms[Math.floor(Math.random() * this.spawnTransforms.length)];
    logger.info(`userId: ${userId} 리스폰!`);
    console.log(user.currentHp);
    console.log(user.stats);
    console.log('-------------------------------');

    user.currentHp = user.statInfo.stats.maxHp;

    console.log(user.currentHp);
    console.log(user.stats);
    const reviveResponse = {
      playerId: userId,
      transform: {
        posX: getSpawnPos[0],
        posY: getSpawnPos[1],
        posZ: getSpawnPos[2],
        rot: 0,
      },
      statInfo: user.statInfo,
    };

    createNotificationPacket(PACKET_ID.S_RevivePlayer, reviveResponse, this.getDungeonUsersUUID());
  };

  startRespawnTimer(userId, respawnTime) {
    if (this.respawnTimers.has(userId)) {
      logger.info(`respawnTimers에 userId: ${userId} 가 이미 존재합니다`);
      return;
    }

    respawnTime *= 1000; // 초기 리스폰 시간 설정

    let startTime = Date.now();
    const timeKey = setTimeout(() => {
      clearTimeout(timeKey); // 타이머 종료
      this.respawnTimers.delete(userId); // 관리 목록에서 제거
      this.onRespawn(userId); // 내부 리스폰 처리
      logger.info(
        `userId : ${userId} 리스폰 함. RespawnTime : ${respawnTime}ms => RemainingTime${Date.now() - startTime}ms`,
      );
    }, respawnTime);
    this.respawnTimers.set(userId, timeKey); // 타이머 등록
  }

  clearAllTimers() {
    this.respawnTimers.forEach((interval) => clearTimeout(interval));
    this.respawnTimers.clear();
    logger.info('모든 리스폰 타이머 클리어!');
  }

  Dispose() {
    if (this.nexus) {
      this.nexus.Dispose();
      this.nexus = null;
    }
    if (this.monsterLogic) {
      this.monsterLogic.Dispose();
      this.monsterLogic = null;
    }

    this.clearAllTimers();
    removeDungeonSession(this.dungeonId);
  }
}

export default Dungeon;
