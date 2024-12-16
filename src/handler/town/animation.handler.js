import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID, getUserById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getAllUserByTown } from '../../sessions/town.session.js';
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
