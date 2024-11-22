import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessions } from '../../sessions/user.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { addRedisParty, getRedisParty, joinRedisParty } from '../../sessions/redis/redis.party.js';

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
      party = await addRedisParty(roomId, dungeonLevel, socket.id);
    } else {
      party = await joinRedisParty(roomId, socket.id);
    }

    const userSessions = getUserSessions();

    const partyPayload = {
      playerId: parseInt(socket.id),
      roomId: parseInt(roomId),
      dungeonLevel: parseInt(dungeonLevel),
    };

    const notification = createNotificationPacket(PACKET_ID.S_PartyJoin, partyPayload);

    userSessions.forEach((session) => {
      session.socket.write(notification);
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

    const members = await getRedisParty(roomdId);

    // 그 소켓들에 S_EnterDungeon던지기

    const response = createResponse(PACKET_ID.S_EnterDungeon, partyPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export { partyJoinHandler, dungeonStartHandler };
