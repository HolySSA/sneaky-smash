import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_EnterPotal {
//     int32 potalId = 1;  // 포탈 고유 ID
//     int32 statId = 2;   // 버프/디버프 ID
//     int32 stat = 3;     // 버프/디버프
// }
const enterPotalHandler = async (socket, payload) => {
  try {
    const { potalId, statId, stat } = Payload;

    const enterPotalpayload = {
      potalId,
      statId,
      stat,
    };
    const response = createResponse(PACKET_ID.S_EnterPortal, enterPotalpayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterPotalHandler;
