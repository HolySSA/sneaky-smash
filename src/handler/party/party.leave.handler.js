import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import {
  getRedisParty,
  leaveRedisParty,
  removeRedisParty,
} from '../../sessions/redis/redis.party.js';
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
    }
    await leaveRedisParty(roomId, socket.id);

    const leavePayload = {
      playerId: socket.id,
      roomId,
    };

    createNotificationPacket(PACKET_ID.S_PartyLeave, leavePayload, getAllUserUUIDByTown());
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
