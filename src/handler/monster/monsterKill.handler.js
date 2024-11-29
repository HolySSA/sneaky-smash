import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { addDungeonSession, getDungeonSession } from '../../sessions/dungeon.session.js';
import { getGameAssets } from '../../init/loadAsset.js';

// 패킷명세
// message C_MonsterKill {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   TransformInfo transform = 2;
// }

// message S_MonsterKill {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   int32 itemId = 2;
//   TransformInfo transform = 3;
// }

const monsterKillHandler = async (socket, payload) => {
  try {
    const { monsterId, transform } = payload;
    console.log('payload:', payload);

    // 임시 세션 만들기
    // 이거 테스트용입니다 본게임하시기전엔 빼시면 됩니다.
    // if (!socket.dungeonId) {
    //   const testSessionId = 'test-dungeon-1';
    //   socket.dungeonId = testSessionId;
    //   if (!getDungeonSession(testSessionId)) {
    //     const dungeonLevel = 1;
    //     const dungeon = addDungeonSession(testSessionId, dungeonLevel);

    //     const gameAssets = getGameAssets();
    //     const testMonster = {
    //       id: 1,
    //       modelId: 2,
    //       name: '붐바스틱',
    //       MaxHp: 100,
    //       ATK: 10,
    //       DEF: 5,
    //       CriticalProbability: 1,
    //       CriticalDamageRate: 1,
    //       MoveSpeed: 3,
    //       attackSpeed: 1,
    //     };
    //     dungeon.monsterLogic.addMonster(1, testMonster);
    //   }
    // }

    const dungeonSession = getDungeonSession(socket.dungeonId);
    console.log('dungeonSession:', dungeonSession);
    const monster = dungeonSession.monsterLogic.getMonsterById(monsterId);
    console.log('monster:', monster);
    const itemId = monster.death();
    console.log('itemId:', itemId);
    dungeonSession.monsterLogic.removeMonster(monsterId);
    // 몬스터 식별 아이디를 가져와서
    // 그녀석을 죽이고
    // 죽은 녀석의 고유아이디값을 다시 반환.

    const monsterKillPayload = {
      monsterId,
      itemId,
      transform: {
        posX: transform.posX,
        posY: transform.posY,
        posZ: transform.posZ,
        rot: 0,
      },
    };

    console.log('monsterKillPayload:', monsterKillPayload);
    const response = createResponse(PACKET_ID.S_MonsterKill, monsterKillPayload);
    console.log('response', response);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default monsterKillHandler;
