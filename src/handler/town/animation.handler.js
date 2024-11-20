import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserById, getAllUsers } from '../../utils/redis/user.session.js';
// 패킷명세
// message C_Animation {
//     int32 animCode = 1;             // 애니메이션 코드
// }
// message S_Animation {
//     int32 playerId = 1;             // 애니메이션을 실행하는 플레이어 ID
//     int32 animCode = 2;             // 애니메이션 코드
// }

const animationHandler = async (socket, payload) => {
  try {
    const { animCode } = payload;

    const user = await getUserById(socket.id);

    const animationPayload = {
      playerId: socket.id,
      animCode,
    };

    const animationResponsePayload = createResponse(PACKET_ID.S_Animation, animationPayload);
    // socket.write(response);
    const allUsers = await getAllUsers();
    if (!allUsers || allUsers.length === 0) {
      console.error('유저세션이 없습니다.');
      return;
    }

    // user ㅇㄷ? - 해당 소켓에 있는 id로 유저 찾으면 될 듯?

    // 로케이션 타입 확인 후 같은 로케이션의 유저들에게 패킷 전송
    allUsers.forEach((targetUser) => {
      if (targetUser.locationType === user.locationType && targetUser.id !== user.id) {
        targetUser.socket.write(animationResponsePayload);
        console.log(`${targetUser.id} 타겟유저아이디패킷전송성공`);
      }
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default animationHandler;
