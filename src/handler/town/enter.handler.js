import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

const enterHandler = async (socket, payload) => {
  try {
    const { player } = payload;
    const spawnPayload = {
      players,
    };
    const response = createResponse(PACKET_ID.S_Spawn, spawnPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterHandler;
