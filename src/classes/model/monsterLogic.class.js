import { getGameAssets } from '../../init/loadAsset.js';
import Monster from './monster.class.js';

class MonsterLogic {
  constructor() {
    this.monsterLists = [];
    this.monsterIndex = 0;
  }

  addMonster(id, monsterInfo) {
    const monster = new Monster(id, monsterInfo);
    this.monsterLists.push(monster);
    return monster;
  }
  removeMonster(monsterId) {
    const index = this.monsterLists.findIndex((monster) => monster.id === monsterId);
    if (index !== -1) {
      this.monsterLists.splice(index, 1);
    }
  }
  getMonsterById(monsterId) {
    return this.monsterLists.find((monster) => monster.id === monsterId);
  }
  moveMonster() {
    this.monsterLists.forEach((monster) => {
      monster.move();
    });
  }

  GameLoopLogic() {
    setInterval(() => {
      moveMonster();
    }, interval);
  }

  addUniqueIndex() {
    return monsterIndex++;
  }
}

export default MonsterLogic;
