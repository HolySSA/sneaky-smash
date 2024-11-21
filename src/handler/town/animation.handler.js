import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getRedisUserById, getRedisUsers } from '../../sessions/redis/redis.user.js';
import { getUserSessions } from '../../sessions/user.session.js';

const animationHandler = async (socket, payload) => {
  try {
    const { animCode } = payload;

    const user = await getRedisUserById(socket.id);

    const animationPayload = {
      playerId: socket.id,
      animCode,
    };

    const animationResponsePayload = createResponse(PACKET_ID.S_Animation, animationPayload);
    // socket.write(response);

    const allUsers = getUserSessions();
    if (!allUsers || allUsers.length === 0) {
      console.error('저장된 유저세션이 없습니다.');
      return;
    }

    const sameLocationType = allUsers.filter(
      (targetUser) => targetUser.locationType === user.locationType,
    );

    if (sameLocationType.length === 0) {
      return;
    }

    // 나를 포함한 모든 유저에게 보냄
    sameLocationType.forEach((targetUser) => {
      targetUser.socket?.write(animationResponsePayload);
      console.log(`${targetUser.id} 유저아이디패킷전송성공`);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default animationHandler;
