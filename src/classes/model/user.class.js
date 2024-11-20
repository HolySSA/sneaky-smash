import Inventory from './inventory.class.js';

class User {
  constructor(id, myClass, nickName) {
    this.id = id;
    this.myClass = myClass;
    this.nickName = nickName;
    this.position = {
      posX: 0,
      posY: 0,
      posZ: 0,
      rot: 0,
    };
    this.locationType = 'town';
    this.Inventory = new Inventory();
    this.skillList = [];
  }
}

export default User;
