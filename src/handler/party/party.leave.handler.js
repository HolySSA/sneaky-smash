import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID, getUserById, getUserSessions } from '../../sessions/user.session.js';
import {
  getRedisParty,
  getRedisUUIDbyMembers,
  leaveRedisParty,
  removeRedisParty,
} from '../../sessions/redis/redis.party.js';
import Result from '../result.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }

// message S_PartyLeave {
// 	int32 playerId = 1;
// 	int32 roomId = 2;
// }

const partyLeaveHandler = async ({ socket, payload }) => {
  var leavePayload;
  var users;
  try {
    const { roomId } = payload;

    leavePayload = {
      playerId: socket.id,
      roomId,
    };

    const party = await getRedisParty(roomId);
    if (!party) {
      leavePayload = {
        playerId: -1,
        roomId,
      };
      //   users = await getRedisUUIDbyMembers(party.members);
    } else if (party.owner === socket.id.toString()) {
      //   users = await getRedisUUIDbyMembers(party.members);
      await removeRedisParty(roomId);
    } else {
      //const remainMembers = await leaveRedisParty(roomId, socket.id);
      // users = await getRedisUUIDbyMembers(remainMembers.members);
    }
    return new Result(leavePayload, PACKET_ID.S_PartyLeave, getAllUserUUIDByTown());
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
