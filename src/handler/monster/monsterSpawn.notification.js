import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getUserSessions } from '../../sessions/user.session.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';

// message S_MonsterSpawn{
// 	MonsterStatus monsters = 1;
// 	TransformInfo transform = 2;
// }
// message TransformInfo {
//   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// }
const randomfunction = (ain) => Math.floor(Math.random() * ain.length);

const monsterSpawnHandler = async (socket, payload) => {
  try {
    const { stageId, transform } = payload;
    console.log('payload:', payload);

    const gameAssets = getGameAssets();
    const monsterAssets = gameAssets.monster.data;
    console.log("🚀 ~ monsterSpawnHandler ~ monsterAssets:", monsterAssets)

    // const dungeonSession = getDungeonSession(socket.id);
    // const dungeonInstance = new Dungeon(dungeonSession.dungeonInfo, dungeonSession.dungeonLevel);
    // const stage = dungeonInstance.getCurrentStage();
    const user = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(user.sessionId);

    const stage = dungeon.stages.find((s) => s.stageId === stageId);

    // const dungeonInfo = gameAssets.dungeonInfo.dungeons;
    // const dungeon = dungeonInfo.find((d) => d.stages.some((stage) => stage.stageId === stageId));
    // const stage = dungeon.stages.find((s) => s.stageId === stageId);

    if (!Array.isArray(monsterAssets)) {
      throw new Error('monsterAssets가 배열이 아닙니다.');
    }

    let monsterWithTransform = [];
    stage.monsters.forEach((monsterData) => {
      const matchedMonster = monsterAssets.find((monster) => monster.monsterId === monsterData.monsterId);
      if (!matchedMonster) {
        throw new Error(`요청한 몬스터 ID가 없음. ${monsterData.monsterId}`);
      }

      for (let i = 0; i < monsterData.count; i++) {
        const monsterPosition = transform[randomfunction(transform)];

        const uniqueId = dungeon.monsterLogic.addUniqueId();
        dungeon.monsterLogic.addMonster(uniqueId, matchedMonster, monsterPosition);

        monsterWithTransform.push({
          monsters: {
            monsterId: uniqueId,
            monsterModel: matchedMonster.id,
            monsterName: matchedMonster.name,
            monsterHp: matchedMonster.MaxHp,
          },
          transform: monsterPosition,
        });
      }
    });

    const monsters = monsterWithTransform;
    const monsterSpawnPayload = {
      monsters,
    };

    const response = createResponse(PACKET_ID.S_MonsterSpawn, monsterSpawnPayload);

    const allUsers = getUserSessions();

    allUsers.forEach((value) => {
        value.socket.write(response);      
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default monsterSpawnHandler;
