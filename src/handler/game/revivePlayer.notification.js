import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/packet/createResponse.js';
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
    // },{},{},{}] //게임실행 부탁드립니다
    console.log('userStats:', userStats);
    const transforms = {
      posX: 2.75,
      posY: -4.65,
      posZ: 73,
      rot: 0,
    };

    const response = createResponse(PACKET_ID.S_RevivePlayer, {
      playerId,
      transform: transforms,
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
