import despawnLogic from '../utils/etc/despawn.logic.js';
import logger from '../utils/logger.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';

const onError = (socket) => async (err) => {
  removeUserQueue(socket);
  despawnLogic(socket);

  logger.error('Socket error:', err);
};

export default onError;
