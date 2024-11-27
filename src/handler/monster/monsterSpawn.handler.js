import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import Dungeon from '../../classes/model/dungeon.class.js';
import { getUserSessions } from '../../sessions/user.session.js';

const randomfunction = (ain) => Math.floor(Math.random() * ain.length);

const monsterSpawnHandler = async (socket, payload) => {
  try {
    const { stageId, transform } = payload;
    console.log('payload:', payload);

    const gameAssets = getGameAssets();
    const monsterAssets = gameAssets.monster.data;

    // const dungeonSession = getDungeonSession(socket.id);
    // const dungeonInstance = new Dungeon(dungeonSession.dungeonInfo, dungeonSession.dungeonLevel);
    // const stage = dungeonInstance.getCurrentStage();

    const dungeonInfo = getDungeonSession(socket.id).dungeonInfo;
    const stage = dungeonInfo.stages.find((s) => s.stageId === stageId);

    // const dungeonInfo = gameAssets.dungeonInfo.dungeons;
    // const dungeon = dungeonInfo.find((d) => d.stages.some((stage) => stage.stageId === stageId));
    // const stage = dungeon.stages.find((s) => s.stageId === stageId);

    let monsterWithTransform = [];
    let uniqueid = 0;
    stage.monsters.forEach((monsterData) => {
      const matchedMonster = monsterAssets.find((monster) => monster.id === monsterData.monsterId);
      if (!matchedMonster) {
        throw new Error(`요청한 몬스터 ID가 없음. ${monsterData.monsterId}`);
      }

      for (let i = 0; i < monsterData.count; i++) {
        const monsterPosition = transform[randomfunction(transform)];
        monsterWithTransform.push({
          monsters: {
            monsterId: uniqueid++,
            monsterModel: matchedMonster.id,
            monsterName: matchedMonster.name,
            monsterHp: matchedMonster.MaxHp,
          },
          transform: monsterPosition,
        });
      }
    });

    console.log('monsterWithTransform:', monsterWithTransform);

    const monsters = monsterWithTransform;
    const monsterSpawnPayload = {
      monsters,
    };

    console.log('monsterSpawnPayload:', monsterSpawnPayload);
    const response = createResponse(PACKET_ID.S_EnterStage, monsterSpawnPayload);

    const allUsers = getUserSessions();
    if (!allUsers || allUsers.length === 0) {
      console.error('유저세션이 없습니다.');
      return;
    }

    allUsers.forEach((value, targetUserId) => {
      if (targetUserId !== user.id) {
        value.socket.write(monsterSpawnPayload);
      }
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default monsterSpawnHandler;

// 저희가 몬스터 스폰을 만들었어요!
// 이제 이 스폰한 몬스터들이 공격하고, 죽고, 움직이는 핸들러를 하기위해선,
// 이 스폰한 몬스터들을 관리한 세션이 필요해요
// 그래서 클래스를 사용해서 세션에 넣고 세션에서 관리를 해줍니다.
