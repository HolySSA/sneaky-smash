import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { addRedisParty, joinRedisParty } from '../../sessions/redis/redis.party.js';
import Result from '../result.js';
import logger from '../../utils/logger.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';

const partyJoinHandler = async ({ socket, payload }) => {
  try {
    const { dungeonLevel, roomId, isOwner } = payload;

    let party = null;
    if (isOwner) {
      party = await addRedisParty(roomId, dungeonLevel, socket.id);
      console.log(`partyJoinHandler. add =>`, party);
    } else {
      party = await joinRedisParty(roomId, socket.id);
      console.log(`partyJoinHandler. join =>`, party);
    }

    if (party.members.length > 4) {
      logger.info(`${roomId}의 파티의 인원이 가득찼습니다.`);
      return;
    }

    const partyPayload = {
      playerId: socket.id,
      roomId,
      dungeonLevel,
    };

    return new Result(partyPayload, PACKET_ID.S_PartyJoin, getAllUserUUIDByTown());
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyJoinHandler;
