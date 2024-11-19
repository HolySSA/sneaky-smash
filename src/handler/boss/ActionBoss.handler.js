import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// // S_ActionBoss: 보스 액션 결과 메시지 (서버 -> 클라이언트)
// message S_ActionBoss {
//     int32 actionBossId = 1;  // 보스 액션 식별 ID
//     BossActionSet actionSet = 2;  // 액션셋
//   }
const actionBossHandler = async (socket, payload) => {
  try {
    const { actionBossId, actionSet } = payload;

    const actionBossPayload = {
      actionBossId,
      actionSet,
    };
    const response = createResponse(PACKET_ID.S_ActionBoss, actionBossPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default actionBossHandler;
