import despawnLogic from '../utils/etc/despawn.logic.js';

const onError = (socket) => async (err) => {
  despawnLogic(socket);

  console.error('Socket error:', err);
};

export default onError;
