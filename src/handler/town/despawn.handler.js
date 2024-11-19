import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_Despawn {
//     repeated int32 playerIds = 1;    // 디스폰되는 플레이어 ID 리스트
// }

const despawnHandler = async (socket, payload) => {
  try {
    const { playerIds } = payload;

    const despawnPayload = {
      playerIds,
    };

    const response = createResponse(PACKET_ID.S_Despawn, despawnPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default despawnHandler;
