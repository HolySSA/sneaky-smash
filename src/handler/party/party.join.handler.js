import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessionById, getUserSessions } from '../../sessions/user.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import {
  addRedisParty,
  getRedisParty,
  joinRedisParty,
  removeRedisParty,
} from '../../sessions/redis/redis.party.js';
import { addDungeonSession } from '../../sessions/dungeon.session.js';

// 패킷명세
// **C_PartyJoin** - 파티에 참여 요청 메시지
// message C_PartyJoin {
//   int32 dungeonLevel = 1;  // 던전 난이도
//   int32 roomId = 2;
//   bool isOner = 3;
// }

// message S_PartyJoin {
// 	int32 playerId = 1;
// 	int32 roomId = 2;
// 	int32 dungeonLevel = 3;
// }

const partyJoinHandler = async (socket, payload) => {
  try {
    const { dungeonLevel, roomId, isOwner } = payload;

    let party = null;
    if (isOwner) {
      party = await addRedisParty(roomId, dungeonLevel, socket.id);
    } else {
      party = await joinRedisParty(roomId, socket.id);
    }

    const userSessions = getUserSessions();

    const partyPayload = {
      playerId: parseInt(socket.id),
      roomId,
      dungeonLevel,
    };

    const notification = createNotificationPacket(PACKET_ID.S_PartyJoin, partyPayload);

    userSessions.forEach((session) => {
      session.socket.write(notification);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

// message S_EnterDungeon {
//   DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//   repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//   string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     repeated StageInfo stage = 2;
// }

// message StageInfo {
//     int32 stageId = 1;                        // 스테이지 ID
//     repeated MonsterStatus monsters = 2;      // 던전에 등장하는 몬스터들의 상태
// }

// message MonsterStatus {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   int32 monsterModel = 2; // 몬스터 모델 ID
//   string monsterName = 3; // 몬스터 이름
//   float monsterHp = 4; // 몬스터 체력
// }

// message PlayerInfo {
//     int32 playerId = 1;             // 플레이어 고유 식별 코드
//     string nickname = 2;            // 플레이어 닉네임
//     int32 class = 3;                // 플레이어 클래스
//     TransformInfo transform = 4;
//     StatInfo statInfo = 5;          // 플레이어 스탯 정보
// }

const dungeonStartHandler = async (socket, payload) => {
  try {
    const { dungeonLevel, roomId } = payload;

    // 파티 세션
    const party = await getRedisParty(roomId);

    // 던전 세션 생성 - dungeonLevel = dungeonId 통용
    const dungeon = addDungeonSession(dungeonLevel);

    // 던전에 유저 추가
    for (const memberId of party.members) {
      const userSession = getUserSessionById(memberId);
      if (userSession) dungeon.addDungeonUser(userSession);
    }

    // 파티 삭제 로직
    const partyPayload = {
      playerId: {},
      roomId,
    };

    const partyResponse = createResponse(PACKET_ID.S_PartyLeave, partyPayload);

    party.members.forEach((memberId) => {
      const user = getUserSessionById(memberId);
      if (user) user.socket.write(partyResponse);
    });

    // stageInfo => stageId로 변경 예정

    const infoText = '던전에 입장했습니다!';

    // 프로토버퍼 확실해 지면 담기
    const enterDungeonPayload = {
      playerId,
      dungeonLevel,
      infoText,
    };

    // 파티원들 던전 입장
    const enterDungeonResponse = createResponse(PACKET_ID.S_EnterDungeon, enterDungeonPayload);
    party.members.forEach((memberId) => {
      const user = getUserSessionById(memberId);
      if (user) user.socket.write(enterDungeonResponse);
    });

    // 파티 세션 삭제
    await removeRedisParty(roomId);
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyJoinHandler;
