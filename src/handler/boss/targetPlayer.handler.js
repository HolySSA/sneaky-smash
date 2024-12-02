import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// // S_TargetPlayer: 보스의 타겟 플레이어 설정 결과 메시지 (서버 -> 클라이언트)
// message S_TargetPlayer {
//     int32 BossId = 1;              // 보스 식별 ID
//     repeated int32 playerId = 2;   // 유저 식별 IDs
//   }
const targetPlayerHandler = async (socket, payload) => {
  try {
    const { BossId, playerId } = payload;

    const targetPlayerPayload = {
      BossId,
      playerId,
    };
    const response = createResponse(PACKET_ID.S_TargetPlayer, targetPlayerPayload);
    socket.write(response);

    global.connectedSockets.forEach((clientSocket) => {
      if (clientSocket !== socket) {
        clientSocket.write(response);
      }
    });

  } catch (e) {
    handleError(socket, e);
  }
};
export default targetPlayerHandler;
