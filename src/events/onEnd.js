import despawnLogic from '../utils/etc/despawn.logic.js';

const onEnd = (socket) => async () => {
  despawnLogic(socket);
};

export default onEnd;
