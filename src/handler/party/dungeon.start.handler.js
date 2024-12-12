import { PACKET_ID } from '../../configs/constants/packetId.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import { addDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { getStatsByUserId, setSessionId } from '../../sessions/redis/redis.user.js';
import { getUserById, getUserSessions } from '../../sessions/user.session.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/packet/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

// message S_EnterDungeon {
//   DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//   repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//   string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     string dungeonName = 2;
// }

// **StatInfo** - 플레이어의 상세 스탯 정보
// message StatInfo {
//   int32 level = 1;                 // 플레이어 레벨
//   float hp = 2;                    // 현재 체력
//   float maxHp = 3;                 // 최대 체력
//   float mp = 4;                    // 현재 마나
//   float maxMp = 5;                 // 최대 마나
//   float atk = 6;                   // 공격력
//   float def = 7;                   // 방어력
//   float speed = 8;                 // 속도
//   float criticalProbability = 9;   // 크리티컬 확률
//   float criticalDamageRate = 10;   // 크리티컬 데미지 비율
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
const dungeonStartHandler = async ({ socket, payload }) => {
  try {
    const { dungeonLevel, roomId } = payload; // 클라에서 레이턴시 추가하기

    // 파티 세션
    const party = await getRedisParty(roomId);
    // 던전 세션 생성 - dungeonLevel = dungeonId = dungeonCode ???
    const sessionId = uuidv4();
    const dungeon = addDungeonSession(sessionId, dungeonLevel);

    const dungeonInfo = {
      dungeonCode: dungeon.dungeonId,
      dungeonName: dungeon.name,
    };

    const infoText = dungeon.name;

    // 파티원 모두의 정보
    const playerInfo = await Promise.all(
      party.members.map(async (memberId) => {
        const userRedis = await findCharacterByUserId(memberId);
        const statInfo = await getStatsByUserId(memberId);

        return {
          playerId: parseInt(memberId),
          nickname: userRedis.nickname,
          class: parseInt(userRedis.myClass),
          transform: { posX: 2.75, posY: -4.65, posZ: 73, rot: 0 },
          statInfo,
        };
      }),
    );

    party.members.forEach(async (memberId) => {
      const user = getUserById(memberId);
      await setSessionId(memberId, sessionId);

      if (user) {
        // 던전 세션 유저 추가
        await dungeon.addDungeonUser(user);

        const enterDungeonPayload = {
          dungeonInfo,
          player: playerInfo,
          infoText,
        };

        const enterDungeonResponse = createResponse(PACKET_ID.S_EnterDungeon, enterDungeonPayload);
        // 던전 유저 진입
        user.socket.write(enterDungeonResponse);
      }
    });

    const partyPayload = {
      playerId: parseInt(party.owner),
      roomId,
    };

    const partyResponse = createResponse(PACKET_ID.S_PartyLeave, partyPayload);

    // 파티 세션 삭제
    await removeRedisParty(roomId);

    // 모든 유저에게 파티 퇴장 패킷 전송
    const userSessions = getUserSessions();
    userSessions.forEach((session) => {
      session.socket.write(partyResponse);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default dungeonStartHandler;
