// import createResponse from '../../utils/response/createResponse.js';
// import { PACKET_ID } from '../../constants/packetId.js';
// import handleError from '../../utils/error/errorHandler.js';
// import { getGameAssets } from '../../init/loadAsset.js';
// import { getDungeonSession } from '../../sessions/dungeon.session.js';
// import Dungeon from '../../classes/model/dungeon.class.js';
// import { getUserSessions } from '../../sessions/user.session.js';

// const randomfunction = (ain) => Math.floor(Math.random() * ain.length);

// const monsterSpawnHandler = async (socket, payload) => {
//   try {
//     const { stageId, transform } = payload;
//     console.log('payload:', payload);

//     const gameAssets = getGameAssets();

//     const monsterAssets = gameAssets.monster.data;

//     // const dungeonInfo = getDungeonSession(socket.id).dungeonInfo;
//     // const stage = dungeonInfo.stages.find((s) => s.stageId === stageId);
//     const dungeonInfo = gameAssets.dungeonInfo.dungeons;

//     const dungeon = dungeonInfo.find((d) => d.stages.some((stage) => stage.stageId === stageId));
//     const stage = dungeon.stages.find((s) => s.stageId === stageId);
//     const monsterstatus = stage.monsters.map((monsterData) => {
//       const matchedMonster = monsterAssets.find((monster) => monster.id === monsterData.monsterId);
//       if (!matchedMonster) {
//         throw new Error(`요청한 몬스터 ID가 없음. ${monsterData.monsterId}`);
//       }

//       return {
//         monsters: {
//           monsterId: monsterData.monsterId, // 몬스터 유니크 아이디로 변경 해야함
//           monsterModel: matchedMonster.id,
//           monsterName: matchedMonster.name,
//           monsterHp: matchedMonster.MaxHp,
//         },
//       };
//     });

//     // 뽑은 데이터랑 랜덤한 좌표를 배열에다 넣는데, 이걸 마리수 만큼 반복

//     const monsterWithTransform = monsterstatus.map((monster) => {
//       const monsterPosition = transform[randomfunction(transform)];
//       return {
//         ...monster,
//         transform: monsterPosition,
//       };
//     });
//     console.log('monsterWithTransform:', monsterWithTransform);

//     const monsters = monsterWithTransform;
//     const monsterSpawnPayload = {
//       monsters,
//     };

//     console.log('monsterSpawnPayload:', monsterSpawnPayload);
//     const response = createResponse(PACKET_ID.S_EnterStage, monsterSpawnPayload);

//     socket.write(response);
//   } catch (e) {
//     handleError(socket, e);
//   }
// };
// export default monsterSpawnHandler;
