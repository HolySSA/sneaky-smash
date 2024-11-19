import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_Animation {
//     int32 playerId = 1;             // 애니메이션을 실행하는 플레이어 ID
//     int32 animCode = 2;             // 애니메이션 코드
// }

const animationHandler = async (socket, payload) => {
  try {
    const { playerId, animCode } = payload;

    const animationPayload = {
      playerId,
      animCode,
    };
    const response = createResponse(PACKET_ID.S_Animation, animationPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default animationHandler;
