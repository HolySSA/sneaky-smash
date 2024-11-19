import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// // S_Phase: 보스 전투의 진행 단계 (서버 -> 클라이언트)
// message S_Phase {
//     int32 phase = 1;   // 페이즈 단계 (단계별 전투 변화)
//   }
const phaseHandler = async (socket, payload) => {
  try {
    const { phase } = payload;

    const phasePayload = {
      phase,
    };
    const response = createResponse(PACKET_ID.S_Phase, phasePayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default phaseHandler;
