// import createResponse from '../../utils/response/createResponse.js';
// import { PACKET_ID } from '../../constants/packetId.js';
// import handleError from '../../utils/error/errorHandler.js';
// import { getGameAssets } from '../../init/loadAsset.js';
// import { getDungeonSession } from '../../sessions/dungeon.session.js';
// import Dungeon from '../../classes/model/dungeon.class.js';
// import { getUserSessions } from '../../sessions/user.session.js';

// message SpawnMonster {
// 	MonsterStatus monsters = 1;
// 	TransformInfo transform = 2;
// }

// message C_EnterStage {
// 	int32 stageId = 1;
// 	repeated TransformInfo transform = 2;
// }

// message S_EnterStage {
// 	repeated SpawnMonster monsters = 1;
// }

// // message MonsterStatus {
// //   int32 monsterId = 1; // 몬스터 식별 ID
// //   int32 monsterModel = 2; // 몬스터 모델 ID
// //   string monsterName = 3; // 몬스터 이름
// //   float monsterHp = 4; // 몬스터 체력
// // }
// // **TransformInfo** - 위치 및 회전 정보
// // message TransformInfo {
// //   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
// //   float posY = 2;   // Y 좌표 (기본값 : 1)
// //   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
// //   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// // }
// const mixingBrank = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };
// const monsterSpawnHandler = async (socket, payload) => {
//   try {
//     const { stageId, transform } = payload;
//     console.log('payload', payload);

//     // Game assets를 불러오기
//     const gameAssets = getGameAssets();
//     const monsterAssets = gameAssets.monster.data;
//     const dungeonInfo = gameAssets.dungeonInfo.dungeons;

//     // 스테이지 정보 찾기
//     const dungeon = dungeonInfo.find((d) => d.stages.some((stage) => stage.stageId === stageId));
//     const stage = dungeon.stages.find((s) => s.stageId === stageId);

//     // 몬스터 데이터 매핑
//     const monsters = stage.monsters.map((monsterData, index) => {
//       const matchedMonster = monsterAssets.find((monster) => monster.id === monsterData.monsterId);
//       if (!matchedMonster) {
//         throw new Error(`요청한 몬스터 ID가 없음. ${monsterData.monsterId}`);
//       }

//       // 몬스터의 위치 정보를 생성 (여기서는 예시로 임의의 위치를 사용)
//       const monsterTransform = {
//         x: transform[index]?.x || 0, // 예시: 위치 배열이 없다면 기본값 0
//         y: transform[index]?.y || 0,
//         z: transform[index]?.z || 0,
//         rotation: transform[index]?.rotation || 0,
//       };
//       //  transfrom : [{1},{2},{3},{4},{5}]
//       //  transfrom : [{2},{1},{5},{4},{3}]
//       console.log('monsterTransform:', monsterTransform);
//       return {
//         monsterId: monsterData.monsterId,
//         monsterModel: matchedMonster.id,
//         monsterName: matchedMonster.name,
//         monsterHp: matchedMonster.MaxHp,
//         transform: monsterTransform, // 몬스터의 위치 정보 추가
//       };
//     });

//     // 몬스터 수량 계산
//     const amount = stage.monsters.map((monsterData) => monsterData.count);
//     console.log('amount', amount);

//     // 몬스터 스폰 응답 페이로드 생성
//     const monsterSpawnPayload = {
//       monsters,
//       transform: stage.monsters.map((_, index) => ({
//         x: transform[index]?.x || 0,
//         y: transform[index]?.y || 0,
//         z: transform[index]?.z || 0,
//         rotation: transform[index]?.rotation || 0,
//       })),
//     };
//     //     console.log('monsterSpawnPayload:', monsterSpawnPayload);
//     //     // 던전 세션을 불러오고 유저에게 응답 전송
//     //     const dungeonSession = getDungeonSession(dungeon.dungeonSessionId);
//     //     console.log('dungeonSession:', dungeonSession);
//     //     const response = createResponse(PACKET_ID.S_MonsterSpawn, monsterSpawnPayload);
//     //     console.log('response:', response);
//     //     const dungeonUsers = dungeonSession.getAllDungeonUsers();

//     //     console.log(`던전 ${dungeon.dungeonId}의 참여 유저 수:`, dungeonUsers.length);

//     //     if (dungeonUsers.length > 0) {
//     //       dungeonUsers.forEach((dungeonUser) => {
//     //         dungeonUser.socket.write(response);
//     //       });
//     //     }
//     const allUsers = getUserSessions();
//     if (!allUsers || allUsers.length === 0) {
//       console.error('유저세션이 없습니다.');
//       return;
//     }

//     // 임시로 모든유저에게 전달.
//     allUsers.forEach((value, targetUserId) => {
//       if (targetUserId !== user.id) {
//         value.socket.write(monsterSpawnPayload);
//       }
//     });
//   } catch (e) {
//     handleError(socket, e);
//   }
// };
// export default monsterSpawnHandler;

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const monsterSpawnHandler = async (socket, payload) => {
  try {
    const { stageId, transform } = payload;

    // transform 배열 섞기
    const shuffledTransform = shuffleArray([...transform]);
    console.log('섞은 후 transform:', shuffledTransform);

    console.log('payload', payload);
    const gameAssets = getGameAssets();
    const monsterAssets = gameAssets.monster.data;
    const dungeonInfo = gameAssets.dungeonInfo.dungeons;

    const dungeon = dungeonInfo.find((d) => d.stages.some((stage) => stage.stageId === stageId));
    const stage = dungeon.stages.find((s) => s.stageId === stageId);

    const monsters = stage.monsters.map((monsterData) => {
      const matchedMonster = monsterAssets.find((monster) => monster.id === monsterData.monsterId);
      if (!matchedMonster) {
        throw new Error(`요청한 몬스터 ID가 없음. ${monsterData.monsterId}`);
      }
      return {
        monsterId: monsterData.monsterId, // 몬스터 유니크 아이디로 변경 해야함
        monsterModel: matchedMonster.id,
        monsterName: matchedMonster.name,
        monsterHp: matchedMonster.MaxHp,
      };
    });
    // console.log('monsters:', monsters);
    const amount = stage.monsters.map((monsterData) => monsterData.count);
    console.log('amount', amount);
    const monsterSpawnPayload = {
      monsters,
      amount,
    };
    // .src/db/Json/monster.Json
    // 아마 json으로 저장된 거 불러와서 비교? loadAsset도 만들어야겠네
    // loadAsset은 json을 불러오는 역활

    // const dungeonSession = getDungeonSession(dungeon.id);
    // const dungeonSession = getDungeonSession(dungeon.dungeonId);

    // const response = createResponse(PACKET_ID.S_MonsterSpawn, monsterSpawnPayload);
    // const dungeonUsers = dungeonSession.getAllDungeonUsers();
    // console.log(`던전 ${dungeon.dungeonId}의 참여 유저 수:`, dungeonUsers.length);
    // if (dungeonUsers.length > 0) {
    //   dungeonUsers.forEach((dungeonUser) => {
    //     dungeonUser.socket.write(response);
    //   });
    // }
    // socket.write(response);
    const response = createResponse(PACKET_ID.S_EnterStage, monsterSpawnPayload);

    // 모든 유저에게 전송
    const allUsers = getUserSessions();
    if (!allUsers || allUsers.size === 0) {
      console.error('유저세션이 없습니다.');
      return;
    }

    allUsers.forEach((value, targetUserId) => {
      if (targetUserId !== socket.id) {
        value.socket.write(response);
      }
    });
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterSpawnHandler;

// 던전에 들어간 사람들의 던전 세션을 생성
// 그 세션안에있는 사람들의 목록을 가져와서
// 그 사람들에게 몬스터 핸들러들을 뿌리기

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// import createResponse from '../../utils/response/createResponse.js';
// import { PACKET_ID } from '../../constants/packetId.js';
// import handleError from '../../utils/error/errorHandler.js';
// import { getGameAssets } from '../../init/loadAsset.js';
// import { getUserSessions } from '../../sessions/user.session.js';

// const shuffleArray = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

// const monsterSpawnHandler = async (socket, payload) => {
//   try {
//     const { stageId, transform } = payload;
//     console.log('받은 페이로드:', payload);

//     // transform 배열 섞기
//     const shuffledTransform = shuffleArray([...transform]);
//     console.log('섞은 후 transform:', shuffledTransform);

//     const monsterSpawnPayload = {
//       monsters: {
//         transform: shuffledTransform,
//       },
//     };
//     console.log('shuffledTransform:', shuffledTransform);

//     // 응답 패킷 생성
//     const response = createResponse(PACKET_ID.S_EnterStage, monsterSpawnPayload);

//     // 모든 유저에게 전송
//     const allUsers = getUserSessions();
//     if (!allUsers || allUsers.size === 0) {
//       console.error('유저세션이 없습니다.');
//       return;
//     }

//     allUsers.forEach((value, targetUserId) => {
//       if (targetUserId !== socket.id) {
//         value.socket.write(response);
//       }
//     });
//   } catch (e) {
//     console.error('Monster spawn error:', e);
//     handleError(socket, e);
//   }
// };

// export default monsterSpawnHandler;
