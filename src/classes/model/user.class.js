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
  }

  updateUserTransform(posX, posY, posZ, rot) {
    this.transform = { posX, posY, posZ, rot };
  }
}

export default User;
