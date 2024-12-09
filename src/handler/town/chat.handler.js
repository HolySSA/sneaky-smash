import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessions } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';

const chatHandler = async (socket, payload) => {
  try {
    const { chatMsg } = payload;

    const chatPayload = {
      playerId: socket.id,
      chatMsg,
    };

    const chatResponsePayload = createResponse(PACKET_ID.S_Chat, chatPayload);

    const allUsers = getUserSessions();
    if (!allUsers || allUsers.length === 0) {
      logger.error('유저세션이 없습니다.');
      return;
    }

    // 같은 로케이션의 유저들에게 패킷 전송
    allUsers.forEach((value) => {
      value.socket.write(chatResponsePayload);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default chatHandler;
