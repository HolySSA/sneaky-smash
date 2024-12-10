import despawnLogic from '../utils/etc/despawn.logic.js';
import logger from '../utils/logger.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';

const onEnd = (socket) => async () => {
  logger.info(`클라이언트와 연결이 종료되었습니다.[${socket.id}] ${socket.UUID}`);
  removeUserQueue(socket);
  despawnLogic(socket);
};

export default onEnd;
