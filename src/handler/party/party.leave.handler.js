import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessionById } from '../../sessions/user.session.js';
import {
  getRedisParty,
  leaveRedisParty,
  removeRedisParty,
} from '../../sessions/redis/redis.party.js';

const partyLeaveHandler = async (socket, payload) => {
  try {
    const { roomId } = payload;

    // 해당 유저를 뺀 파티원들
    const members = await leaveRedisParty(roomId, socket.id);

    const party = await getRedisParty(roomId);
    if (party.owner === socket.id) {
      // 현재 파티 목록에서 제거
      await removeRedisParty();

      const payload = {
        playerId: {},
        roomId,
        dungeonLevel: party.dungeonLevel,
      };

      const response = createResponse(PACKET_ID.S_Party, payload);

      party.members.forEach((member) => {
        const user = getUserSessionById(member);

        user.socket.write(response);
      });

      return;
    }

    // 페이로드
    const partyPayload = {
      playerId: members,
      roomId,
    };

    const response = createResponse(PACKET_ID.S_PartyLeave, partyPayload);

    members.forEach((member) => {
      if (member !== socket.id) {
        const user = getUserSessionById(member);
        user.socket.write(response);
      }
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
