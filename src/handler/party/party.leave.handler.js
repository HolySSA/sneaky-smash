import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID, getUserById, getUserSessions } from '../../sessions/user.session.js';
import {
  getRedisParty,
  leaveRedisParty,
  removeRedisParty,
} from '../../sessions/redis/redis.party.js';
import Result from '../result.js';

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }

// message S_PartyLeave {
// 	int32 playerId = 1;
// 	int32 roomId = 2;
// }

const partyLeaveHandler = async ({ socket, payload }) => {
  var leavePayload,
    users = [];
  try {
    const { roomId } = payload;

    leavePayload = {
      playerId: parseInt(socket.id),
      roomId,
    };

    const party = await getRedisParty(roomId);
    if (!party) {
      leavePayload = {
        playerId: -1,
        roomId,
      };
    } else if (party.owner === socket.id.toString()) {
      await removeRedisParty(roomId);
      console.log("방장 나감",party.owner," = " , socket.id);
      users = getAllUserUUID();
      /*
      party.members.forEach((memberId) => {
        const user = getUserById(memberId);
        user?.socket.write(response);
      });
      */

      // const users = getUserSessions();
      // users.forEach((user) => {
      //   user.socket.write(response);
      // });
    } else {
      const remainMembers = await leaveRedisParty(roomId, socket.id);
      console.log("방장아닌 사람 나감",party.owner," = " , socket.id);
      users = getAllUserUUID();
      // const response = createResponse(PACKET_ID.S_PartyLeave, leavePayload);

      // remainMembers.members.forEach((memberId) => {
      //   const user = getUserById(memberId);
      //   console.log('남은 멤버 : ', memberId);
      //   user?.socket.write(response);
      // });

      // const users = getUserSessions();
      // users.forEach((user) => {
      //   console.log('남은 유저 : ', user);
      //   user.socket.write(response);
      // });

      /*
      party.members.forEach((memberId) => {
        const user = getUserById(parseInt(memberId));
        user?.socket.write(response);
      });
      */
    }
  } catch (e) {
    handleError(socket, e);
  }

  return new Result(leavePayload, PACKET_ID.S_PartyLeave, users);
};

export default partyLeaveHandler;
