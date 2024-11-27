import { PACKET_ID } from '../../constants/packetId.js';
import { addDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import {
  getRedisUserById,
  getStatsByUserId,
  setSessionId,
} from '../../sessions/redis/redis.user.js';
import { getUserSessionById, getUserSessions } from '../../sessions/user.session.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

// message S_EnterDungeon {
//   DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//   repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//   string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     repeated int32 stageList = 2; // 스테이지 셔플 된 아이디 리스트
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

const dungeonStartHandler = async (socket, payload) => {
  try {
    const { dungeonLevel, roomId } = payload;

    // 파티 세션
    const party = await getRedisParty(roomId);
    // 던전 세션 생성 - dungeonLevel = dungeonId = dungeonCode ???
    const sessionId = uuidv4();
    const dungeon = addDungeonSession(sessionId, dungeonLevel);

    const stageList = dungeon.getStageIdList();
    const dungeonInfo = {
      dungeonCode: dungeon.dungeonId,
      stageList,
    };

    const infoText = dungeon.name;

    // 파티원 모두의 정보
    const playerInfo = await Promise.all(
      party.members.map(async (memberId) => {
        const userRedis = await getRedisUserById(memberId);
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
      const userSession = getUserSessionById(memberId);
      await setSessionId(memberId, sessionId);

      if (userSession) {
        // 던전 세션 유저 추가
        dungeon.addDungeonUser(userSession);

        const enterDungeonPayload = {
          dungeonInfo,
          player: playerInfo,
          infoText,
        };

        const enterDungeonResponse = createResponse(PACKET_ID.S_EnterDungeon, enterDungeonPayload);
        // 던전 유저 진입
        userSession.socket.write(enterDungeonResponse);
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
