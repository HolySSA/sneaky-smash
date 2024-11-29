import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// // 몬스터 체력 업데이트 (S_UpdateMonsterHp)
// message S_UpdateMonsterHp {
//     float hp = 1;                // 몬스터의 체력
//   }

// const updateMonsterHpHandler = async (socket, payload) => {
//   try {
//     const { hp } = payload;

//     const updateMonsterHpPayload = {
//       hp,
//     };

//     const response = createResponse(PACKET_ID.S_UpdateMonsterHp, updateMonsterHpPayload);
//     socket.write(response);
//   } catch (e) {
//     handleError(socket, e);
//   }
// };

const updateMonsterHpHandler = async (socket, payload) => {
  try {
    const { hp } = payload;

    // 클라이언트한테 받은 체력정보
    const updateMonsterHpPayload = { hp };
    const response = createResponse(PACKET_ID.S_UpdateMonsterHp, updateMonsterHpPayload);

    // 나한테 전송
    socket.write(response);

    // 주변 유저에게 전송
    global.connectedSockets.forEach((clientSocket) => {
      if (clientSocket !== socket) {
        clientSocket.write(response);
      }
    });

  } catch (e) {
    handleError(socket, e);
  }
};

export default updateMonsterHpHandler;
