import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getRedisParties } from '../../sessions/redis/redis.party.js';
import handleError from '../../utils/error/errorHandler.js';
import Result from '../result.js';

const partyHandler = async ({ socket, payload }) => {
  try {
    const parties = await getRedisParties();
    if (!parties) {
      return;
    }
    var partyInfo = [];

    parties.forEach((party) => {
      const partyPayload = {
        playerId: party.members,
        roomId: party.roomId,
        dungeonLevel: party.dungeonLevel,
      };
      partyInfo.push(partyPayload);
    });

    return new Result({ partyInfo }, PACKET_ID.S_Party);
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyHandler;
