import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_UseSkill {
//     int32 playerId = 1;          // 플레이어 고유 ID
//     int32 skillId = 2;           // 스킬 ID
//     optional int32 targetPlayerId = 3;    // 스킬 사용된 플레이어 ID (선택적)
//     optional int32 targetMonsterId = 4;   // 적용된 몬스터 ID (선택적)
//   }
const useSkillHandler = async (socket, payload) => {
  try {
    const { playerId, skillId, targetPlayerId, targetMonsterId } = payload;

    const useSkillPayload = {
      playerId,
      skillId,
      targetPlayerId,
      targetMonsterId,
    };
    const response = createResponse(PACKET_ID.S_UseSkill, useSkillPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useSkillHandler;
