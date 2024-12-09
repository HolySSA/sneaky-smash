import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisPartyByUserId, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { removeRedisUser } from '../../sessions/redis/redis.user.js';
import { getUserSessions, removeUserSession } from '../../sessions/user.session.js';
import createNotificationPacket from '../notification/createNotification.js';

// message S_Despawn {
//     repeated int32 playerIds = 1;    // 디스폰되는 플레이어 ID 리스트
// }

const despawnLogic = async (socket) => {
  const payload = {
    playerIds: [parseInt(socket.id)],
  };

  await removeRedisUser(socket);

  const party = await getRedisPartyByUserId(socket.id);
  if (party) {
    await removeRedisParty(party.roomId);
  }

  removeUserSession(socket);

  const response = createNotificationPacket(PACKET_ID.S_Despawn, payload);

  const sessions = getUserSessions();
  if (sessions) {
    for (const [key, value] of sessions) {
      value.socket.write(response);
    }
  }
};

export default despawnLogic;
