import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessionById, getUserSessions } from '../../sessions/user.session.js';
import {
  getRedisParty,
  leaveRedisParty,
  removeRedisParty,
} from '../../sessions/redis/redis.party.js';

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }

// message S_PartyLeave {
// 	int32 playerId = 1;
// 	int32 roomId = 2;
// }

const partyLeaveHandler = async (socket, payload) => {
  try {
    const { roomId } = payload;

    const leavePayload = {
      playerId: parseInt(socket.id),
      roomId,
    };

    const party = await getRedisParty(roomId);
    if (!party) {
      const errorPayload = {
        playerId: -1,
        roomId,
      };

      const errorResponse = createResponse(PACKET_ID.S_PartyLeave, errorPayload);
      socket.write(errorResponse);
      return;
    }

    if (party.owner === socket.id) {
      await removeRedisParty(roomId);

      const response = createResponse(PACKET_ID.S_PartyLeave, leavePayload);

      // party.members.forEach((memberId) => {
      //   const user = getUserSessionById(memberId);
      //   user?.socket.write(response);
      // });

      const users = getUserSessions();
      users.forEach((user) => {
        user.socket.write(response);
      });
    } else {
      const remainMembers = await leaveRedisParty(roomId, socket.id);

      const response = createResponse(PACKET_ID.S_PartyLeave, leavePayload);

      remainMembers.members.forEach((memberId) => {
        const user = getUserSessionById(memberId);
        user?.socket.write(response);
      });

      const users = getUserSessions();
      users.forEach((user) => {
        user.socket.write(response);
      });

      /*
      party.members.forEach((memberId) => {
        const user = getUserSessionById(parseInt(memberId));
        user?.socket.write(response);
      });
      */
    }
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
