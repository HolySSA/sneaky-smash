import { getStatsByUserId } from '../../sessions/redis/redis.user.js';
import LatencyManager from '../manager/latency.manager.js';
import MonsterLogic from './monsterLogic.class.js';
import logger from '../../utils/logger.js';
import { removeDungeonSession } from '../../sessions/dungeon.session.js';

class Dungeon {
  constructor(dungeonInfo) {
    this.dungeonId = dungeonInfo.dungeonId;
    this.name = dungeonInfo.name;
    this.users = new Map();
    this.monsterLogic = new MonsterLogic(this);

    this.nexusCurrentHp = 100;
    this.nexusMaxHp = 100;

    this.latencyManager = new LatencyManager();
  }

  async addDungeonUser(user) {
    const userId = user.socket.id.toString();

    if (this.users.has(userId)) {
      throw new Error('이미 던전에 참여 중인 유저입니다.');
    }

    const statsInfo = await getStatsByUserId(userId);

    const dungeonUser = {
      user: user,
      statsInfo,
    };

    this.users.set(userId, dungeonUser);
    this.latencyManager.addUser(userId, user.ping.bind(user), 1000);

    return user;
  }

  removeDungeonUser(userId) {
    const userIdStr = userId.toString();

    if (this.users.has(userIdStr)) {
      this.latencyManager.removeUser(userIdStr);
      const result = this.users.delete(userIdStr);

      if (this.users.size === 0) {
        this.monsterLogic.pathServer.onClose();
        this.latencyManager.clearAll();
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
    removeDungeonSession(this.sessionId);
  }

  getDungeonUser(userId) {
    const userIdStr = userId.toString();

    return this.users.get(userIdStr) || null;
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
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    if (!user) {
      throw new Error('유저가 존재하지 않습니다.');
    }

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

    return user;
  }

  addUserExp(userId, exp) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);
    if (!user) {
      logger.info(user);
    }
    user.statsInfo.exp += exp;
    logger.info(`플레이어 ${userIdStr}의 경험치 get +${exp} 현재경험치 ${user.statsInfo.exp}`);
    return user.statsInfo.exp;
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
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    // 방어력 관련
    user.currentHp -= damage;

    return user.currentHp;
  }

  updatePlayerHp(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    // 스탯 불러오기 수정
    const maxHp = user.statsInfo.stats.maxHp;
    const newHp = user.currentHp + amount;
    user.currentHp = Math.max(0, Math.min(newHp, maxHp));

    return user.currentHp;
  }

  increasePlayerAtk(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.atk = Math.min(amount + user.atk, user.atk);

    return user.atk;
  }

  increasePlayerDef(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.def = Math.min(amount + user.def, user.def);

    return user.def;
  }

  increasePlayerMaxHp(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.maxHp = Math.min(amount + user.maxHp, user.maxHp);

    return user.maxHp;
  }

  increasePlayerMoveSpeed(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.d = Math.min(amount + user.moveSpeed, user.moveSpeed);

    return user.moveSpeed;
  }

  increasePlayerCriticalProbability(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.d = Math.min(amount + user.criticalProbability, user.criticalProbability);

    return user.criticalProbability;
  }
  increasePlayerCriticalDamageRate(userId, amount) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.d = Math.min(amount + user.criticalDamageRate, user.criticalDamageRate);

    return user.criticalDamageRate;
  }

  nexusDamaged(damage) {
    this.nexusCurrentHp -= damage;
    return this.nexusCurrentHp;
  }
}

export default Dungeon;
