import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// // S_BossSpawn: 보스 소환 결과 메시지 (서버 -> 클라이언트)
// message S_BossSpawn {
//     repeated BossStatus boss = 1; // 보스 정보
//   }
const bossSpawnHandler = async (socket, payload) => {
  try {
    const { boss } = payload;

    const bossSpawnPayload = { boss };
    const response = createResponse(PACKET_ID.S_BossSpawn, bossSpawnPayload);
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
export default bossSpawnHandler;
