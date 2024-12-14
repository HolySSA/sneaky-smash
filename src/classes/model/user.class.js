import { PACKET_ID } from '../../configs/constants/packetId.js';
import logger from '../../utils/logger.js';
import createResponse from '../../utils/packet/createResponse.js';
import { enqueueSend } from '../../utils/socket/messageQueue.js';

class User {
  #pingQueue = [];
  #intervalId = null;
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.transform = {
      posX: -5,
      posY: 0.5,
      posZ: 135,
      rot: 0,
    };
    this.latency = 0;
    this.myClass = 0;
    this.nickname = '';
    this.dungeonId = '';

    this.#intervalId = setInterval(this.ping.bind(this), 1000);
  }

  ping() {
    if (this.#pingQueue.length > 4) {
      return;
    }

    if (this.#pingQueue.length === 4) {
      logger.warn(`User[${this.socket.id}] is reached maximum ping size`);
    }

    const serverTime = Date.now();
    const buffer = createResponse(PACKET_ID.S_Ping, { serverTime });
    enqueueSend(this.socket.UUID, buffer);
    this.#pingQueue.push(serverTime);
  }

  handlePong(clientTime) {
    if (this.#pingQueue.length <= 0) {
      logger.error(
        `User[${this.socket.id}] recevied pong message but pingQueue is empty : ${clientTime}`,
      );
      return;
    }
    const serverTime = this.#pingQueue.shift();
    this.latency = (clientTime - serverTime) / 2;
  }

  getLatency() {
    return this.latency;
  }

  updateUserTransform(posX, posY, posZ, rot) {
    this.transform = { posX, posY, posZ, rot };
  }

  dispose() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }
}

export default User;
