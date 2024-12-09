import despawnLogic from '../utils/etc/despawn.logic.js';
import { removeUserQueue } from '../utils/socket/messageQueue.js';

const onEnd = (socket) => async () => {
  removeUserQueue(socket);
  despawnLogic(socket);
};

export default onEnd;
