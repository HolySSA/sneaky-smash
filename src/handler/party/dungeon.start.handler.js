import { PACKET_ID } from '../../constants/packetId.js';
import { addDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { getUserSessionById } from '../../sessions/user.session.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';

// message S_EnterDungeon {
//   DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//   repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//   string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     repeated StageInfo stage = 2;
// }

// message DungeonInfo {
//     int32 dungeonCode = 1;    // 던전 코드
//     repeated int32 stageList = 2; // 스테이지 셔플 된 아이디 리스트
// }

const dungeonStartHandler = async (socket, payload) => {
  try {
    const { dungeonLevel, roomId } = payload;

    // 파티 세션
    const party = await getRedisParty(roomId);
    // 던전 세션 생성 - dungeonLevel = dungeonId = dungeonCode ???
    const dungeon = addDungeonSession(dungeonLevel);

    const partyPayload = {
      playerId: parseInt(party.owner),
      roomId,
    };

    const partyResponse = createResponse(PACKET_ID.S_PartyLeave, partyPayload);

    const stageList = dungeon.getStageIdList();

    // 던전 들어가기 패킷
    const enterDungeonPayload = {
      dungeonCode: dungeonLevel,
      stageList,
    };

    // 파티원들 던전 입장
    const enterDungeonResponse = createResponse(PACKET_ID.S_EnterDungeon, enterDungeonPayload);

    party.members.forEach((memberId) => {
      const userSession = getUserSessionById(memberId);
      if (userSession) {
        // 파티 탈퇴(파티 제거)
        userSession.socket.write(partyResponse);
        // 던전 세션 유저 추가
        dungeon.addDungeonUser(userSession);
        // 던전 유저 진입
        userSession.socket.write(enterDungeonResponse);
      }
    });

    // 파티 세션 삭제
    await removeRedisParty(roomId);
  } catch (e) {
    handleError(socket, e);
  }
};

export default dungeonStartHandler;
