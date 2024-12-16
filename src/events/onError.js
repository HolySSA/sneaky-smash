import despawnLogic from '../utils/etc/despawn.logic.js';
import logger from '../utils/logger.js';

const onError = (socket) => async (err) => {
  despawnLogic(socket);
  logger.warn(`클라이언트와 연결이 종료되었습니다.[${socket.id}] ${socket.UUID}`);
};

export default onError;
