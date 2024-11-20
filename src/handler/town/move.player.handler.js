import { PACKET_ID } from '../../constants/packetId.js';
import {
  getUserById,
  getAllUsers,
  updateUserTransformById,
} from '../../utils/redis/user.session.js';
import createResponse from '../../utils/response/createResponse.js';

/**
 * 무브 핸들러
 * @param {object} socket - 클라이언트 소켓
 * @param {object} payload - 클라이언트에서 전송한 데이터
 */
export const movePlayerHandler = async (socket, payload) => {
  try {
    const { posX, posY, posZ, rot } = payload.transform;

    // 소켓에서 유저 정보 가져오기
    const user = await getUserById(socket.id);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    // ~법  클라가 이동할 위치를 미리 계산

    // const transform = await getUserTransformById(socket.id);
    const transform = await updateUserTransformById(posX, posY, posZ, rot, socket.id);
    if (!transform) {
      throw new Error('위치정보를 찾을 수 없습니다.');
    }

    // 유저 위치 업데이트 - redis에 저장될 유저 세션에 position을 넣어야 한다.
    // user.position = { posX, posY, posZ, rot };

    // S_Move 패킷 데이터 생성
    // const moveResponsePayload = {
    //   playerId: user.id,
    //   transform: {
    //     posX: user.position.posX,
    //     posY: user.position.posY,
    //     posZ: user.position.posZ,
    //     rot: user.position.rot,
    //   },
    // };

    const movePayload = {
      playerId: user.id,
      transform: transform,
    };

    const moveResponsePayload = createResponse(PACKET_ID.S_Move, movePayload);

    const allUsers = await getAllUsers();
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
