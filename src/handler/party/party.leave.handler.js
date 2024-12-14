import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import Result from '../result.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';
import logger from '../../utils/logger.js';

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }

// message S_PartyLeave {
// 	int32 playerId = 1;
// 	int32 roomId = 2;
// }

const partyLeaveHandler = async ({ socket, payload }) => {
  try {
    const { roomId } = payload;

    const leavePayload = {
      playerId: socket.id,
      roomId,
    };

    const party = await getRedisParty(roomId);

    if (!party) {
      logger.error('파티가 존재하지 않습니다');
      return;
    }

    if (party.owner === socket.id.toString()) {
      await removeRedisParty(roomId);
    }

    return new Result(leavePayload, PACKET_ID.S_PartyLeave, getAllUserUUIDByTown());
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
