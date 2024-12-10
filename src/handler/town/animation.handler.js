import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID, getUserSessions } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';

const animationHandler = async ({ socket, payload }) => {
  var animationPayload;
  const allUsers = getAllUserUUID();
  try {
    const { animCode } = payload;

    animationPayload = {
      playerId: socket.id,
      animCode,
    };
  } catch (e) {
    handleError(socket, e);
  }
  return new Result(animationPayload, PACKET_ID.S_Animation, allUsers);
};

export default animationHandler;
