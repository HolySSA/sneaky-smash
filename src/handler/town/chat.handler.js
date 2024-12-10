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
  console.log("채팅 보내는 유저세션 :  " ,allUsers);
  if (!allUsers || allUsers.length === 0) {
    logger.error('유저세션이 없습니다.');
    return;
  }
  console.log("채팅 페이로드 : ",chatPayload);
  return new Result(chatPayload, PACKET_ID.S_Chat, allUsers);
};

export default chatHandler;
