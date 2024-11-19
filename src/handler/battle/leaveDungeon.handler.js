import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// 던전에서 나가는 응답 (S_LeaveDungeon)
// message S_LeaveDungeon {
//     int32 playerId = 1;          // 던전에서 나간 플레이어 ID
//   }

const leaveDungeonHandler = async (socket, payload) => {
  try {
    const { playerId } = payload;

    const leaveDungeonPayload = {
      playerId,
    };

    const response = createResponse(PACKET_ID.S_LeaveDungeon, leaveDungeonPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default leaveDungeonHandler;
