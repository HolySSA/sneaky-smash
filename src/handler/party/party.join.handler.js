import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { createParty, getParty, joinParty } from '../../utils/redis/party.session.js';
import { getUserById } from '../../utils/redis/user.session.js';

// 패킷명세
// **C_PartyJoin** - 파티에 참여 요청 메시지
// message C_PartyJoin {
//   int32 dungeonLevel = 1;  // 던전 난이도
//   int32 roomId = 2;
//   bool isOner = 3;
// }

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }

// message  C_MatchStart {
// 	int32 dungeonLevel = 1; // 던전 들어가기
// 	int32 roomdId = 2; // 방번호
// }

// // **S_Party** - 파티 정보 응답 메시지
// message S_Party {
//   repeated int32 playerId = 1;    // 파티에 참여 중인 유저들의 ID 리스트
//   int32 roomId = 2;         // 던전 난이도
// }

// message S_EnterDungeon {
//     DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//     repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//     string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     repeated StageInfo stage = 2;
// }

// message StageInfo {
//     int32 stageId = 1;                        // 스테이지 ID
//     repeated MonsterStatus monsters = 2;      // 던전에 등장하는 몬스터들의 상태
// }

// // **StatInfo** - 플레이어의 상세 스탯 정보
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

const partyJoinHandler = async (socket, payload) => {
  try {
    const { dungeonLevel, roomId, isOner } = payload;

    let party = null;
    if (isOner) {
      party = await createParty(roomId, socket.id);
    } else {
      party = await joinParty(roomId, socket.id);
    }

    // C_Party로 파티 요청 -> S_Party로 해당 파티원들에게 패킷 전달.
    // 방장이 매치 시작하면, 해당 파티원들에게 S_던전들어가기 패킷 전달.

    const partyPayload = {
      playerId: party.members,
      roomId,
    };

    const response = createResponse(PACKET_ID.S_Party, partyPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

const dungeonStartHandler = async (socket, payload) => {
  try {
    const { dungeonLevel, roomdId } = payload;

    const infoText = '던전에 입장했습니다!';

    const partyPayload = {
      playerId,
      dungeonLevel,
      infoText,
    };

    const members = await getParty(roomdId);

    // 해당 파티에 있는 id로 유저에 있는 id의 socket불러오기.
    members.forEach((member) => {
      const user = getUserById(member);
    });

    // 그 소켓들에 S_EnterDungeon던지기

    const response = createResponse(PACKET_ID.S_EnterDungeon, partyPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export { partyJoinHandler, dungeonStartHandler };
