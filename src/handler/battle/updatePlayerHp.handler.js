import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// // 플레이어 체력 업데이트 (S_UpdatePlayerHp)
// message S_UpdatePlayerHp {
//     float hp = 1;                // 플레이어의 체력
//   }

const updatePlayerHpHandler = async (socket, payload) => {
  try {
    const { hp } = payload;

    const updatePlayerHpPayload = {
      hp,
    };

    const response = createResponse(PACKET_ID.S_UpdatePlayerHp, updatePlayerHpPayload);
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
export default updatePlayerHpHandler;
