import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { addDungeonSession, getDungeonSession } from '../../sessions/dungeon.session.js';
// 패킷명세

const useItemHandler = async (socket, payload) => {
  try {
    const { itemId } = payload;
    const playerId = 1;
    if (!socket.dungeonId) {
      const testSessionId = 'test-dungeon-1';
      socket.dungeonId = testSessionId;
      if (!getDungeonSession(testSessionId)) {
        const dungeonLevel = 1;
        const dungeon = addDungeonSession(testSessionId, dungeonLevel);

        const gameAssets = getGameAssets();
        const testMonster = {
          id: 1,
          modelId: 2,
          name: '붐바스틱',
          MaxHp: 100,
          ATK: 10,
          DEF: 5,
          CriticalProbability: 1,
          CriticalDamageRate: 1,
          MoveSpeed: 3,
          attackSpeed: 1,
        };
        dungeon.monsterLogic.addMonster(1, testMonster);
        const testUserStats = {
          level: 1,
          hp: 100,
          MaxHp: 1000,
          atk: 1,
          def: 1,
          Speed: 3,
          CriticalDamageRate: 1,
          CriticalProbability: 1,
        };
        dungeon.users.set('1', {
          userId: '1',
          socket: socket,
          stats: testUserStats,
        });
      }
    }
    const gameAssets = getGameAssets();
    const itemAssets = gameAssets.item.data;

    const item = itemAssets.find((item) => item.itemid === itemId);
    console.log('item:', item);
    const dungeonSession = getDungeonSession(socket.dungeonId);
    console.log('dungeonSession:', dungeonSession);
    const currentHp = dungeonSession.getUserHp(playerId);
    console.log('currentHp:', currentHp);
    const hp = currentHp + item.curHp;
    console.log('hp:', hp);
    // 사용한 아이템 정보를 받는다 ( 현재는 체력 회복 포션 )
    // itemId를 토대로 정보를 가져온다 ( Json이나 DB에 저장된 데이터)
    // 가져온 데이터와 해당 유저 Id를 반환한다

    // 여기서 적용되는 HP를 updatePlayerHp로 보내준다
    //
    const useItemPayload = {
      hp,
    };

    const response = createResponse(PACKET_ID.S_UseItem, useItemPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useItemHandler;

// status 레디스 저장 상태동기화가 필요한 정보
//
