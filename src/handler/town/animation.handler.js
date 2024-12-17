import { PACKET_ID } from '../../configs/constants/packetId.js';
import broadcastBySession from '../../utils/notification/broadcastBySession.js';

const animationHandler = async ({ socket, payload }) => {
  var animationPayload;
  const { animCode } = payload;

  animationPayload = {
    playerId: socket.id,
    animCode,
  };
  broadcastBySession(socket, PACKET_ID.S_Animation, animationPayload);
};

export default animationHandler;
