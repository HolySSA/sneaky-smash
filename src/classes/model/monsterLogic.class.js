import { getGameAssets } from '../../init/loadAsset.js';
import Monster from './monster.class.js';

class MonsterLogic {
  constructor() {
    this.monsterLists = [];
    this.monsterIndex = 0;
  }

  addMonster(id, monsterInfo) {
    const monster = new Monster(id, monsterInfo);
    monsterLists.push(monster);
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
