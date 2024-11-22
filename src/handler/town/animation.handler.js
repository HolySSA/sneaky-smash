import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessions } from '../../sessions/user.session.js';

const animationHandler = async (socket, payload) => {
  try {
    const { animCode } = payload;

    const animationPayload = {
      playerId: socket.id,
      animCode,
    };

    const animationResponsePayload = createResponse(PACKET_ID.S_Animation, animationPayload);

    const allUsers = getUserSessions();
    if (!allUsers || allUsers.length === 0) {
      console.error('저장된 유저세션이 없습니다.');
      return;
    }

    allUsers.forEach((value) => {
      value.socket.write(animationResponsePayload);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default animationHandler;
