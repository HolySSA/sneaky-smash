import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisUserById, getRedisUsers } from '../../sessions/redis/redis.user.js';
import createResponse from '../../utils/response/createResponse.js';
import { updateUserTransformById } from '../../sessions/user.session.js';

/**
 * 무브 핸들러
 * @param {object} socket - 클라이언트 소켓
 * @param {object} payload - 클라이언트에서 전송한 데이터
 */
export const movePlayerHandler = async (socket, payload) => {
  try {
    const { posX, posY, posZ, rot } = payload.transform;

    // 소켓에서 유저 정보 가져오기
    const user = await getRedisUserById(socket.id);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    const transform = updateUserTransformById(socket.id, posX, posY, posZ, rot);

    if (!transform) {
      throw new Error('위치정보를 찾을 수 없습니다.');
    }

    const movePayload = {
      playerId: user.id,
      transform: transform,
    };

    const moveResponsePayload = createResponse(PACKET_ID.S_Move, movePayload);

    const allUsers = await getRedisUsers();
    if (!allUsers || allUsers.length === 0) {
      console.error('유저세션이 없습니다.');
      return;
    }

    // 로케이션 타입 확인 후 같은 로케이션의 유저들에게 패킷 전송
    allUsers.forEach((targetUser) => {
      if (targetUser.locationType === user.locationType && targetUser.id !== user.id) {
        targetUser.socket.write(moveResponsePayload);
        console.log(`${targetUser.id} 타겟유저아이디패킷전송성공`);
      }
    });
  } catch (error) {
    console.error('무브 핸들러 실행 중 오류 발생:', error.message);
  }
};
