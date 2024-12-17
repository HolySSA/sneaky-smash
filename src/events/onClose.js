import despawnLogic from '../utils/etc/despawn.logic.js';

const onClose = (socket) => async () => {
  // console.log(`onClose => ${socket.id} / ${socket.UUID}`);
  despawnLogic(socket);
};

export default onClose;
