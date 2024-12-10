import { removeUserForTown } from '../sessions/town.session.js';
import { removeUserSession } from '../sessions/user.session.js';
import despawnLogic from '../utils/etc/despawn.logic.js';
import logger from '../utils/logger.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';

const onError = (socket) => async (err) => {
  removeUserQueue(socket);
  removeUserForTown(socket.id);
  removeUserSession(socket);
  // despawnLogic(socket);

  logger.warn(`클라이언트와 연결이 종료되었습니다.[${socket.id}] ${socket.UUID}`);
};

export default onError;
