import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_MonsterDamage {
//     int32 playerId = 1; // 플레이어 식별 ID
//     int32 monsterId = 2; // 몬스터 식별 ID
//     int32 damage = 3; // 데미지
//   }
// message C_MonsterDamage {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   int32 damage = 2; // 데미지
// }
const monsterDamageHandler = async (socket, payload) => {
  try {
    const { playerId, monsterId, damage } = payload;

    const monsterDamagePayload = {
      playerId,
      monsterId,
      damage,
    };
    const response = createResponse(PACKET_ID.S_MonsterDamage, monsterDamagePayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterDamageHandler;
