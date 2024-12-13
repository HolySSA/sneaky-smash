import { reverseMapping } from '../../configs/constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';
import { getUserById } from '../../sessions/user.session.js';
import logger from '../logger.js';
import createNotificationPacket from './createNotification.js';

/**
 * 해당 유저가 관련된 세션에 브로드캐스트를 합니다.
 *
 * isExceptCurrentUser - true로 하면 targetUUIDs에서 socket.UUID를 배제합니다.
 */
const broadcastBySession = (socket, packetId, payload, isExceptCurrentUser = false) => {
  const user = getUserById(socket.id);
  if (!user) {
    logger.error(`broadcastBySession. ${reverseMapping[packetId]} => User is null`);
    return;
  }
  const dungeon = getDungeonSession(user.dungeonId);
  let targetUUIDs = [];
  if (dungeon) {
    targetUUIDs = dungeon.usersUUID;
  } else {
    targetUUIDs = getAllUserUUIDByTown();
  }

  if (isExceptCurrentUser === true) {
    targetUUIDs = targetUUIDs.filter((uuid) => uuid !== socket.UUID);
  }

  if (targetUUIDs.length > 0) {
    createNotificationPacket(packetId, payload, targetUUIDs);
  }
};

export default broadcastBySession;
