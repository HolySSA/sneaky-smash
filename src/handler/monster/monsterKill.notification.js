import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_MonsterKill {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   int32 itemId = 2;
//   int32 skillId = 3;
//   TransformInfo transform = 4;
// }
// message TransformInfo {
//   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// }
const monsterKillNotification = async (socket, payload) => {
  try {
    const { monsterId, itemId } = payload;

    const monsterKillPayload = {
      monsterId,
      itemId,
      skillId,
      transform,
    };
    const response = createResponse(PACKET_ID.S_MonsterKill, monsterKillPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default monsterKillNotification;
