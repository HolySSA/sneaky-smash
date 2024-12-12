import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID } from '../../sessions/user.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { addRedisParty, getRedisUUIDbyMembers, joinRedisParty } from '../../sessions/redis/redis.party.js';
import Result from '../result.js';

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
  var partyPayload;
  var Members;
  try {
    const { dungeonLevel, roomId, isOwner } = payload;

    let party = null;
    if (isOwner) {
      party = await addRedisParty(roomId, dungeonLevel, socket.id);
    } else {
      party = await joinRedisParty(roomId, socket.id);
    }
    if(party.members.length >= 4){
      throw new Error('파티의 인원이 가득찼습니다.');
      return;
    }
    Members = await getRedisUUIDbyMembers(party.members);

    partyPayload = {
      playerId: parseInt(socket.id),
      roomId,
      dungeonLevel,
    }; 
  } catch (e) {
    handleError(socket, e);
  }
  return new Result(partyPayload, PACKET_ID.S_PartyJoin, Members);
};

export default partyJoinHandler;
