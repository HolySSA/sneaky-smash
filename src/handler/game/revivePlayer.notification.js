import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
// message S_RevivePlayer {
//     int32 playerId = 1;
//     TransformInfo transform = 2;
//     StatInfo statInfo = 3;
//     }
const revivePlayerNotification = async (socket, playerId) => {
  try {
    const redisUser = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    const userStats = dungeon.getUserStats(playerId);
    // transform = [{
    // },{},{},{}]
    transform = [
      {
        posX: 0,
        posY: 0,
        posZ: 0,
        rot: 0,
      },
    ];
    const response = createResponse(PACKET_ID.S_RevivePlayer, {
      playerId,
      transform,
      statInfo: userStats,
    });

    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default revivePlayerNotification;
