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
    this.latency = 0;
    this.lastPingTime = Date.now();
    this.myClass = 0;
    this.nickname = '';
  }

  updateLatency(latency) {
    this.latency = latency;
  }

  ping() {
    this.lastPingTime = Date.now();
    //this.socket.write(createPingPacket(this.lastPingTime));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;

    // console.log(`${this.id}: ${this.latency}ms`);
  }

  getLatency() {
    return this.latency;
  }

  updateUserTransform(posX, posY, posZ, rot) {
    this.transform = { posX, posY, posZ, rot };
  }
}

export default User;
