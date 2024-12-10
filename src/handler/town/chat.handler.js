import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';

const chatHandler = async ({ socket, payload }) => {
  var chatPayload;
  try {
    const { chatMsg } = payload;

    chatPayload = {
      playerId: socket.id,
      chatMsg,
    };
  } catch (e) {
    handleError(socket, e);
  }
  const allUsers = getAllUserUUID();
  if (!allUsers || allUsers.length === 0) {
    logger.error('유저세션이 없습니다.');
    return;
  }
  return new Result({ chatPayload, message: '채팅 송신' }, PACKET_ID.S_Chat, allUsers);
};

export default chatHandler;
