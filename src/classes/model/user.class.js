class User {
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.transform = {
      posX: -5,
      posY: 0.5,
      posZ: 135,
      rot: 0,
    };
    this.skillList = [];
    this.monsterKillCount = 0;
    this.userKillCount = 0;
  }

  updateUserTransform(posX, posY, posZ, rot) {
    this.transform = { posX, posY, posZ, rot };
  }

  // 몬스터를 사냥하면 카운트가 올라갑니다.
  increaseMonsterKillCount() {
    this.monsterKillCount++;
  }

  // 유저가 유저를 잡을 경우 카운트가 올라갑니다.
  increaseUserKillCount() {
    this.userKillCount++;
  }
}

export default User;
