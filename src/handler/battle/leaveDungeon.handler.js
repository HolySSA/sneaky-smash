import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// 던전에서 나가는 응답 (S_LeaveDungeon)
// message S_LeaveDungeon {
//     int32 playerId = 1;          // 던전에서 나간 플레이어 ID
//   }

// const leaveDungeonHandler = async (socket, payload) => {
//   try {
//     const { playerId } = payload;

//     const leaveDungeonPayload = {
//       playerId,
//     };

//     const response = createResponse(PACKET_ID.S_LeaveDungeon, leaveDungeonPayload);
//     socket.write(response);
//   } catch (e) {
//     handleError(socket, e);
//   }
// };

const leaveDungeonHandler = async (socket, payload) => {
  try {
    const { playerId } = payload;

    const leaveDungeonPayload = { playerId };
    const response = createResponse(PACKET_ID.S_LeaveDungeon, leaveDungeonPayload);

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

export default leaveDungeonHandler;


// 해당 내용은 나중에 지우기
// 현재 연결된 모든 소켓을 담고 있는 global.connectedSockets 배열을 순회
// 그래서 이 이벤트(핸들러)를 발생시킨 소켓을 제외하고 나머지 다른 소켓에게 이러한 응답 메시지를 전송함.