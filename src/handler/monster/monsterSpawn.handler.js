import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../loadAsset.js';
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
    const { monsters, amount } = payload;
    const gameAssets = getGameAssets();
    const monsterAssets = gameAssets.monster.data;
    const matchedMonsters = monsters.map((monsterId) => {
      const matchedMonster = monsterAssets.find((monster) => monster.id === monsterId);
      if (!matchedMonster) {
        throw new Error(`요청한 몬스터 ID미아 ${monsterId}`);
      }
      return {
        monsterId, // 몬스터 유니크 아이디로 변경 해야함
        monsterModel: matchedMonster.id,
        monsterName: matchedMonster.name,
        monsterHp: matchedMonster.MaxHp,
      };
    });

    const monsterSpawnPayload = {
      monsters: matchedMonsters,
      amount,
    };
    // .src/db/Json/monster.Json
    // 아마 json으로 저장된 거 불러와서 비교? loadAsset도 만들어야겠네
    // loadAsset은 json을 불러오는 역활
    const response = createResponse(PACKET_ID.S_MonsterSpawn, monsterSpawnPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterSpawnHandler;
