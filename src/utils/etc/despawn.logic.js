import { PACKET_ID } from '../../configs/constants/packetId.js';
import partyLeaveHandler from '../../handler/party/party.leave.handler.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisPartyByUserId, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { setIsSignIn } from '../../sessions/redis/redis.user.js';
import { getAllUserUUIDByTown, removeUserForTown } from '../../sessions/town.session.js';
import { getUserById, removeUserSession } from '../../sessions/user.session.js';
import broadcastBySession from '../notification/broadcastBySession.js';
import createNotificationPacket from '../notification/createNotification.js';
import { removeUserQueue } from '../socket/messageQueue.js';

// message S_Despawn {
//     repeated int32 playerIds = 1;    // 디스폰되는 플레이어 ID 리스트
// }

const despawnLogic = async (socket) => {
  const userId = socket.id;
  removeUserQueue(socket);
  const user = getUserById(userId);

  if (user) {
    await setIsSignIn(userId, false);
    //console.log(`despawnLogic`, user.dungeonId);
    const payload = {
      playerIds: [userId],
    };

    broadcastBySession(socket, PACKET_ID.S_Despawn, payload, true);

    const dungeon = getDungeonSession(user.dungeonId);
    if (dungeon) {
      await dungeon.removeDungeonUser(userId);
    }
    removeUserForTown(userId);

    const party = await getRedisPartyByUserId(userId);
    if (party) {
      await partyLeaveHandler({ socket: { id: userId }, payload: { roomId: party.roomId } });
    }
  }

  removeUserSession(socket);
};

export default despawnLogic;
