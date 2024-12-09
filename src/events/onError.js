import despawnLogic from '../utils/etc/despawn.logic.js';
import logger from '../utils/logger.js';

const onError = (socket) => async (err) => {
  despawnLogic(socket);

  logger.error('Socket error:', err);
};

export default onError;
