import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessions } from '../../sessions/user.session.js';
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
    const { monsterId, damage } = payload;

    // socket에서 playerId 추출
    const playerId = socket.id;
    if (!playerId) {
      throw new Error(`소켓 안에 플레이어 정보가 없습니다.`);
    }

    // 몬스터가 유저에게 데미지를 입힐 때
    const monsterDamagePayload = {
      playerId,
      monsterId,
      damage,
    };

    const response = createResponse(PACKET_ID.S_MonsterDamage, monsterDamagePayload);

    const users = getUserSessions();
    if (users) {
      users.forEach((user) => {
        console.log(`${playerId}가 ${monsterId} 몬스터 ${damage} 공격`);
        user.socket.write(response);
      });
    }
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterDamageHandler;
