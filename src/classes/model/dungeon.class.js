import MonsterLogic from "./monsterLogic.class.js";

class Dungeon {
  constructor(dungeonInfo) {
    this.dungeonId = dungeonInfo.dungeonId;
    this.name = dungeonInfo.name;
    this.stages = this.getRandomStages(dungeonInfo.stages, 3);
    this.currentStage = 0;
    this.users = new Map();
    this.monsterLogic = new MonsterLogic();
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

  addDungeonUser(userSession) {
    if (!userSession.socket.id) {
      throw new Error('유효하지 않은 유저 세션입니다.');
    }

    const userId = userSession.socket.id.toString();

    if (this.users.has(userId)) {
      throw new Error('이미 던전에 참여 중인 유저입니다.');
    }

    const dungeonUser = {
      userId: userId,
      socket: userSession.socket,
      transform: { posX: 0, posY: 0, posZ: 0, rot: 0 }, // 던전 입장 시 초기 위치
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
  getUserStats(userId) {
    const user = this.getDungeonUser(userId);
    return user.stats;
  }

  getUserHp(userId) {
    const stats = this.getUserStats(userId);
    return stats.hp;
  }

  getAllDungeonUsers() {
    return Array.from(this.users.values());
  }

  getCurrentStage() {
    return this.stages[this.currentStage];
  }

  nextStage() {
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
  }

  // 스테이지 중 3개 할당해서 적용하기
  getcurrentStages() {}
}

export default Dungeon;
