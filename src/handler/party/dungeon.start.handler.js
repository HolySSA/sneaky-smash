import { PACKET_ID } from '../../configs/constants/packetId.js';
import { addDungeonSession, getStatsByUserClass } from '../../sessions/dungeon.session.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { setSessionId } from '../../sessions/redis/redis.user.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';
import { getUserById } from '../../sessions/user.session.js';
import handleError from '../../utils/error/errorHandler.js';
import logger from '../../utils/logger.js';
import makeUUID from '../../utils/makeUUID.js';
import createResponse from '../../utils/packet/createResponse.js';
import { enqueueSend } from '../../utils/socket/messageQueue.js';
import Result from '../result.js';

// message S_EnterDungeon {
//   DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//   repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//   string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     string dungeonName = 2;
// }

// message Stats {
//   int32 atk = 1;
//   int32 def = 2;
//   int32 curHp = 3;
//   int32 maxHp = 4;
//   int32 moveSpeed = 5;
//   float criticalProbability = 6;
//   float criticalDamageRate = 7;
// }

// // **StatInfo** - 플레이어의 상세 스탯 정보
// message StatInfo {
//   int32 level = 1;                 // 플레이어 레벨
//   Stats stats = 2;
//   float exp = 3;                   // 경험치
//   float maxExp = 4;
// }

// // **TransformInfo** - 위치 및 회전 정보
// message TransformInfo {
//   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// }

// message PlayerInfo {
//     int32 playerId = 1;             // 플레이어 고유 식별 코드
//     string nickname = 2;            // 플레이어 닉네임
//     int32 class = 3;                // 플레이어 클래스
//     TransformInfo transform = 4;
//     StatInfo statInfo = 5;          // 플레이어 스탯 정보
// }

// message  C_MatchStart {
// 	int32 dungeonLevel = 1; // 던전 들어가기
// 	int32 roomId = 2; // 방번호
// }

//TODO :2명이상이면 출발할 수 있음
/**
 *  TODO
 *
 *  addDungeonUser에 하자가 심각히 있음.
 *  user를 value값으로 넣어주는데 별도의 객체로 만듦.
 *  userClass를 보면 statsInfo가 전혀없음.
 *  따라서 던전에 유저를 추가할떄 StatsInfo를 추가해주는데,
 *  Stats와 Exp를 담고 있음.
 *
 *  Proto메세지를 보면 StatInfo가 있음. 이름 통일 필요
 *
 *  그리고 레디스에서 유저 스탯을 가져오는데, 애초에 여기서 가져올 이유도 없는 것 같음.
 *  정상화 필요
 *
 */
const dungeonStartHandler = async ({ socket, payload }) => {
  const transforms = [
    [2.5, 0.5, 112],
    [2.5, 0.5, -5.5],
    [42, 0.5, 52.5],
    [-38, 0.5, 52.5],
  ];
  try {
    const { dungeonLevel, roomId } = payload; // 클라에서 레이턴시 추가하기

    // 파티 세션
    const party = await getRedisParty(roomId);
    // 던전 세션 생성 - dungeonLevel = dungeonId = dungeonCode ???
    const dungeonId = makeUUID();
    const dungeon = addDungeonSession(dungeonId, dungeonLevel);

    const dungeonInfo = {
      dungeonCode: dungeon.dungeonId,
      dungeonName: dungeon.name,
    };

    // 파티원 모두의 정보
    const playerInfo = party.members.map((playerId) => {
      const user = getUserById(Number(playerId));
      console.log(user);
      console.log(`PlayerID => ${playerId}`);
      const transformData = transforms.pop() || [0, 0, 0];
      const transform = {
        posX: transformData[0],
        posY: transformData[1],
        posZ: transformData[2],
        rot: 0, // rotation 값은 나중에 받으면 수정
      };

      const statInfo = getStatsByUserClass(user.myClass);

      if (!statInfo) {
        logger.error('스탯 정보가 존재하지 않습니다');
        return;
      }

      return {
        playerId,
        nickname: user.nickname,
        class: user.myClass,
        transform,
        statInfo,
      };
    });

    party.members.forEach(async (memberId) => {
      const user = getUserById(Number(memberId));
      await setSessionId(memberId, dungeonId);

      if (user) {
        // 해당 유저 던전아이디 추가
        user.dungeonId = dungeonId;
        // 던전 세션 유저 추가
        await dungeon.addDungeonUser(user);

        const enterDungeonPayload = {
          dungeonInfo,
          player: playerInfo,
          infoText: '',
        };

        const enterDungeonResponse = createResponse(PACKET_ID.S_EnterDungeon, enterDungeonPayload);

        // 던전 유저 진입
        enqueueSend(user.socket.UUID, enterDungeonResponse);
      }
    });

    const partyPayload = {
      playerId: party.owner,
      roomId,
    };

    await removeRedisParty(roomId);

    return new Result(partyPayload, PACKET_ID.S_PartyLeave, getAllUserUUIDByTown());
  } catch (e) {
    handleError(socket, e);
  }
};

export default dungeonStartHandler;
