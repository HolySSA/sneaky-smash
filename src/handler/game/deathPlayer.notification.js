import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/packet/createResponse.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getGameAssets } from '../../init/loadAsset.js';
import revivePlayerNotification from './revivePlayer.notification.js';

// message S_DeathPlayer { ★
//     int32 playerId = 1;
//     float spawnTime = 2;
//     }
const deathPlayerNotification = async (socket, playerId) => {
  try {
    const redisUser = await getRedisUserById(playerId);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    const userLevel = dungeon.getUserStats(playerId).stats.level;
    // const playerLevel = redisUser.level;

    const gameAssets = getGameAssets();
    const spawnTimeInfo = gameAssets.spawnTimeInfo.data;
    const spawnTime = spawnTimeInfo.find((id) => id.level === userLevel);

    const response = createResponse(PACKET_ID.S_DeathPlayer, { playerId, spawnTime });

    allUsers.forEach((value) => {
      value.socket.write(response);
    });

    setTimeout(() => {
      revivePlayerNotification(socket, playerId);
    }, spawnTime * 1000); // spawnTime은 초 단위, 밀리초로 변환
  } catch (err) {
    handleError(socket, err);
  }
};

export default deathPlayerNotification;
