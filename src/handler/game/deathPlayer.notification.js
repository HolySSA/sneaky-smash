import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getGameAssets } from '../../init/loadAsset.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getUserById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';

// message S_DeathPlayer { ★
//     int32 playerId = 1;
//     float spawnTime = 2;
//     }
const deathPlayerNotification = (socket, playerId) => {
  try {
    const userBySession = getUserById(playerId);

    if (!userBySession) {
      logger.error(`useItemHandler. Could not found user : ${playerId}`);
      return;
    }

    if (!userBySession.dungeonId) {
      logger.error(`useItemHandler. this player not in the dungeon : ${playerId}`);
      return;
    }
    const dungeon = getDungeonSession(userBySession.dungeonId);    
    const userLevel = dungeon.getUserStats(playerId).level;

    const spawnTimeAssets = getGameAssets().spawnTimeInfo;
    const spawnTime = spawnTimeAssets[userLevel].spawnTime;  

    createNotificationPacket(PACKET_ID.S_DeathPlayer, { playerId, spawnTime }, dungeon.getDungeonUsersUUID());

    // setTimeout(() => {
    //   revivePlayerNotification(socket, playerId);
    // }, spawnTime * 1000); // spawnTime은 초 단위, 밀리초로 변환
  } catch (err) {
    handleError(socket, err);
  }
};

export default deathPlayerNotification;
