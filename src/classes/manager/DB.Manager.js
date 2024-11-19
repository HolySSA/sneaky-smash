import Item from '../model/item.class.js';

class DBManager {
  constructor() {
    this.itemTable = [];
    this.equipmentTable = [];
    this.bossTable = [];
    this.skillTable = [];    
    this.monsterTable = [];
    this.userTable = [];
    this.dungeonTable = [];
  }

}

export default new DBManager();
