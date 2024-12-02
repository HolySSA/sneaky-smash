import { getStatsByUserId } from "../../sessions/redis/redis.user.js";
import MonsterLogic from "./monsterLogic.class.js";

class Dungeon {
  constructor(dungeonInfo) {
    this.dungeonId = dungeonInfo.dungeonId;
    this.name = dungeonInfo.name;
    this.stages = this.getRandomStages(dungeonInfo.stages, 3);
    this.currentStage = 0;
    this.users = new Map();
    this.monsterLogic = new MonsterLogic();

    this.nexusCurrentHp = 100;
    this.nexusMaxHp = 100;
  }

  getRandomStages(allStages, count) {
    const stages = [...allStages];
    const selectedStages = [];

    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * stages.length);

      const selectedStage = stages.splice(index, 1)[0];
      selectedStages.push({
        stageId: selectedStage.stageId,
        monsters: selectedStage.monsters.map((monster) => ({
          monsterId: monster.monsterId,
          count: monster.count,
        })),
      });
    }

    return selectedStages;
  }

  getCurrentStage() {
    return this.stages[this.currentStage];
  }

  getAllStages() {
    return this.stages.map((stage) => ({
      stageId: stage.stageId,
      monsters: stage.monsters,
    }));
  }

  getStageIdList() {
    return this.stages.map((stage) => stage.stageId);
  }

  async addDungeonUser(userSession) {
    if (!userSession.socket.id) {
      throw new Error('유효하지 않은 유저 세션입니다.');
    }

    const userId = userSession.socket.id.toString();

    if (this.users.has(userId)) {
      throw new Error('이미 던전에 참여 중인 유저입니다.');
    }

    const statsInfo = await getStatsByUserId(userId);

    const dungeonUser = {
      socket: userSession.socket,
      currentHp: statsInfo.maxHp,
      transform: { posX: 0, posY: 0, posZ: 0, rot: 0 }, // 던전 입장 시 초기 위치
      statsInfo
    };

    this.users.set(userId, dungeonUser);
    return userSession;
  }

  removeDungeonUser(userId) {
    const userIdStr = userId.toString();
    if (this.users.has(userIdStr)) return this.users.delete(userIdStr);
  }

  getDungeonUser(userId) {
    const userIdStr = userId.toString();

    return this.users.get(userIdStr) || null;
  }

  getAllUsers() {
    return this.users;
  }

  getUserStats(userId) {
    const user = this.getDungeonUser(userId);
    return user.statsInfo;
  }

  setUserStats(userId) {
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    if(!user){
      throw new Error("유저가 존재하지 않습니다.");
    }

    // 레벨 퍼당 스탯을 가져와서 @@@@@@@@@@@@@@ 밑에 스탯에 추가 해주면 됨.

    user.statsInfo = {
      level: user.statsInfo.level + 1,
        hp: user.statsInfo.hp,
        maxHp: user.statsInfo.maxHp,
        atk: user.statsInfo.atk,
        def: user.statsInfo.def,
        speed: user.statsInfo.speed,
        criticalProbability: user.statsInfo.criticalProbability,
        criticalDamageRate: user.statsInfo.criticalDamageRate      
    }

    return user;
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

  damagedUser(userId, damage){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    // 방어력 관련
    user.currentHp -= damage;

    return user.currentHp;
  }

  recoveryPlayerHp(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    // 방어력 관련
    user.currentHp = Math.min(amount + user.currentHp, user.maxHp);

    return user.currentHp;
  }

  increasePlayerAtk(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.atk = Math.min(amount + user.atk, user.atk);

    return user.atk;
  }

  increasePlayerDef(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.def = Math.min(amount + user.def, user.def);

    return user.def;
  }

  increasePlayerMaxHp(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.maxHp = Math.min(amount + user.maxHp, user.maxHp);

    return user.maxHp;
  }
  
  increasePlayerMoveSpeed(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.d = Math.min(amount + user.moveSpeed, user.moveSpeed);

    return user.moveSpeed;
  }

  increasePlayerCriticalProbability(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.d = Math.min(amount + user.criticalProbability, user.criticalProbability);

    return user.criticalProbability;
  }

  increasePlayerCriticalDamageRate(userId, amount){
    const userIdStr = userId.toString();
    const user = this.users.get(userIdStr);

    user.d = Math.min(amount + user.criticalDamageRate, user.criticalDamageRate);

    return user.criticalDamageRate;
  }
}
  
  nexusDamaged(damage)
  {
    this.nexusCurrentHp -= damage;
    return this.nexusCurrentHp;
  }

export default Dungeon;
