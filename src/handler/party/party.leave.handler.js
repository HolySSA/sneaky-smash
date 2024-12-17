import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import Result from '../result.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const partyLeaveHandler = async ({ socket, payload }) => {
  try {
    const { roomId } = payload;

    const party = await getRedisParty(roomId);

    if (!party) {
      logger.error('파티가 존재하지 않습니다');
      return;
    }

    if (party.owner == socket.id) {
      await removeRedisParty(roomId);
      for (const playerId of party.members) {
        createNotificationPacket(
          PACKET_ID.S_PartyLeave,
          { playerId, roomId },
          getAllUserUUIDByTown(),
        );
      }
      return;
    }

    const leavePayload = {
      playerId: socket.id,
      roomId,
    };

    return new Result(leavePayload, PACKET_ID.S_PartyLeave, getAllUserUUIDByTown());
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
