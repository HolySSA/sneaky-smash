import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getRedisPartyByUserId, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { getAllUserUUIDByTown, removeUserForTown } from '../../sessions/town.session.js';
import { removeUserSession } from '../../sessions/user.session.js';
import logger from '../logger.js';
import broadcastBySession from '../notification/broadcastBySession.js';
import createNotificationPacket from '../notification/createNotification.js';
import { removeUserQueue } from '../socket/messageQueue.js';

// message S_Despawn {
//     repeated int32 playerIds = 1;    // 디스폰되는 플레이어 ID 리스트
// }

const despawnLogic = async (socket) => {
  removeUserQueue(socket);
  removeUserSession(socket);
  if (!socket.id) {
    logger.warn(`despawnLogic이 호출되었으나 id값이 할당되지 않았습니다. [${socket.UUID}]`);
    return;
  }
  removeUserForTown(socket.id);
  const payload = {
    playerIds: [socket.id],
  };

  const AllUUID = getAllUserUUIDByTown();
  const party = await getRedisPartyByUserId(socket.id);
  if (party) {
    if (party.members.length <= 1) {
      await removeRedisParty(party.roomId);
    }
    const leavePayload = {
      playerId: socket.id,
      roomId: party.roomId,
    };
    createNotificationPacket(PACKET_ID.S_PartyLeave, leavePayload, AllUUID);
  }

  broadcastBySession(socket, PACKET_ID.S_Despawn, payload, true);
};

export default despawnLogic;
