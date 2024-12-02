import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
// 패킷명세
// message S_MonsterSpawn {
//     repeated MonsterStatus monsters = 1; // 몬스터 정보
//     repeated int32 amount = 2; // 몬스터 마리수
//   }
// message MonsterStatus {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   int32 monsterModel = 2; // 몬스터 모델 ID
//   string monsterName = 3; // 몬스터 이름
//   float monsterHp = 4; // 몬스터 체력
// }
const monsterSpawnHandler = async (socket, payload) => {
  try {
    const { transform } = payload;

    const response = createResponse(PACKET_ID.S_MonsterSpawn, monsterSpawnPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterSpawnHandler;
