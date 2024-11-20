import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserById, getAllUsers } from '../../utils/redis/user.session.js';
// 패킷명세
// message C_Chat {
//     string chatMsg = 1;             // 채팅 메시지 내용
// }
// message S_Chat {
//     int32 playerId = 1;             // 채팅을 받는 플레이어 ID
//     string chatMsg = 2;             // 채팅 메시지 내용
// }

const chatHandler = async (socket, payload) => {
  try {
    const { chatMsg } = payload;
    const user = await getUserById(socket.id);
    const chatPayload = {
      playerId: socket.id,
      chatMsg,
    };

    const chatResponsePayload = createResponse(PACKET_ID.S_Chat, chatPayload);

    const allUsers = await getAllUsers();
    if (!allUsers || allUsers.length === 0) {
      console.error('유저세션이 없습니다.');
      return;
    }

    // user ㅇㄷ?

    // 로케이션 타입 확인 후 같은 로케이션의 유저들에게 패킷 전송
    allUsers.forEach((targetUser) => {
      if (targetUser.locationType === user.locationType && targetUser.id !== user.id) {
        targetUser.socket.write(chatResponsePayload);
        console.log(`${targetUser.id} 타겟유저아이디패킷전송성공`);
      }
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default chatHandler;
