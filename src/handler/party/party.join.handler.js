import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { createParty, getParty, joinParty } from '../../utils/redis/party.session.js';
import { getUserById, getUserSessions } from '../../utils/redis/user.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

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
    const { dungeonLevel, roomId, isOner } = payload;

    let party = null;
    if (isOner) {
      party = await createParty(roomId, dungeonLevel, socket.id);
    } else {
      party = await joinParty(roomId, socket.id);
    }

    // C_Party로 파티 요청 -> S_Party로 해당 파티원들에게 패킷 전달.
    // 방장이 매치 시작하면, 해당 파티원들에게 S_던전들어가기 패킷 전달.

    const users = await getUserSessions();

    const partyPayload = {
      playerId: socket.id,
      roomId,
      dungeonLevel,
    };

    const notification = createNotificationPacket(PACKET_ID.S_PartyJoin, partyPayload);

    users.forEach((user) => {
      user.socket.write(notification);
    });
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
