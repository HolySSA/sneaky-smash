import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import getAllProtoFiles from '../../init/protofiles.js';
import { addDungeonSession, getDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisUserById, getStatsByUserId } from '../../sessions/redis/redis.user.js';
import { getGameAssets } from '../../init/loadAsset.js';
// 패킷명세
// message S_MonsterAttack {
//     int32 playerId = 1; // 플레이어 식별 ID
//     int32 hp = 2;
//   }
// message C_MonsterAttack {
//   int32 monsterId = 2; // 몬스터 식별 ID
// }

const monsterAttackHandler = async (socket, payload) => {
  try {
    const { monsterId } = payload;
    console.log('payload', payload);
    // 임시 세션 만들기
    // 이거 테스트용입니다 본게임하시기전엔 빼시면 됩니다.
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
    // const playerId = '1'; // 테스트용
    const playerId = socket.id; // 실전용
    console.log('playerId', playerId);
    //     socket에서 playerId 추출
    const dungeonSession = getDungeonSession(socket.dungeonId);
    console.log('dungeonSession', dungeonSession);
    const monster = dungeonSession.monsterLogic.getMonsterById(monsterId);
    console.log('monster', monster);
    const UserStats = dungeonSession.getUserStats(playerId);
    console.log('UserStats', UserStats);
    const monsterInfo = getGameAssets().monster.data.find((m) => m.id === monster.modelId);
    console.log('monsterInfo', monsterInfo);
    const baseDamage = Math.max(1, monsterInfo.ATK - UserStats.def);
    console.log('baseDamage', baseDamage);
    const isCritical = Math.random() < monsterInfo.CriticalProbability / 100;
    console.log('isCritical', isCritical);
    let finalDamage = baseDamage;
    if (isCritical) {
      finalDamage = baseDamage * (1 + monsterInfo.CriticalDamageRate / 100);
    }
    const currentHp = dungeonSession.getUserHp(playerId);
    const newHp = Math.max(0, currentHp - finalDamage);
    // 몬스터가 유저에게 데미지를 입힐 때
    const monsterAttackPayload = {
      playerId,
      hp: Math.floor(newHp),
    };

    const response = createResponse(PACKET_ID.S_MonsterAttack, monsterAttackPayload);
    // const allUsers = getUserSessions();
    // if (!allUsers || allUsers.length === 0) {
    //   console.error('유저세션이 없습니다.');
    //   return;
    // }

    // allUsers.forEach((value, targetUserId) => {
    //   if (targetUserId !== user.id) {
    //     value.socket.write(response);
    //   }
    // });
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterAttackHandler;
