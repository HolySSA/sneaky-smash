import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import {
  addRedisParty,
  joinRedisParty,
} from '../../sessions/redis/redis.party.js';
import Result from '../result.js';
import logger from '../../utils/logger.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';

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

const partyJoinHandler = async ({ socket, payload }) => {
  try {
    const { dungeonLevel, roomId, isOwner } = payload;
    
    let party = null;
    if (isOwner) {
      party = await addRedisParty(roomId, dungeonLevel, socket.id);
    } else {
      party = await joinRedisParty(roomId, socket.id);
    }
    if (party.members.length >= 4) {
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
