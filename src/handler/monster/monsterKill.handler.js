import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_MonsterKill {
//     int32 monsterId = 1; // 몬스터 식별 ID
//     int32 itemId = 2; // 아이템 식별 ID
//   }
const monsterKillHandler = async (socket, payload) => {
  try {
    const { monsterId, itemId } = payload;

    const monsterKillPayload = {
      monsterId,
      itemId,
    };
    const response = createResponse(PACKET_ID.S_MonsterKill, monsterKillPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterKillHandler;
