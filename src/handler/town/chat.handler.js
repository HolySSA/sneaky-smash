import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import {
  getUserById,
  getAllUsers,
  updateUserTransformById,
} from '../../utils/redis/user.session.js';
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

    const chatPayload = {
      playerId: socket.id,
      chatMsg,
    };

    // const response = createResponse(PACKET_ID.S_Chat, chatPayload);
    // const allUsers = await getUserById();
    // if(!allUsers || allUsers.length === 0){
    //   console.error('유저세션미아');
    //   return;
    // }
    // allUsers.forEach((targetUser)=> {
    //   if(targetUser.locationType)
    // })
    // socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default chatHandler;
