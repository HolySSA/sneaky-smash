import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// 몬스터 액션 응답 (S_MonsterAction)
// message S_MonsterAction {
//     int32 actionMonsterIdx = 1;  // 액션을 취하는 몬스터 인덱스
//     ActionSet actionSet = 2;     // 몬스터의 액션 설정
//   }
const monsterActionHandler = async (socket, payload) => {
  try {
    const { actionMonsterIdx, actionSet } = payload;

    const monsterActionPayload = {
      actionMonsterIdx,
      actionSet,
    };

    const response = createResponse(PACKET_ID.S_MonsterAction, monsterActionPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterActionHandler;
