import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/packet/createResponse.js';

// message S_LevelUp {
//     int32 playerId = 1;  // 레벨업하는 유저ID
//     StatInfo statInfo = 2; // 레벨
//   }

const levelUpNotification = async (socket) => {
  try {
    const playerId = socket.id;

    const user = await getRedisUserById(playerId);

    const dungeon = getDungeonSession(user.sessionId);

    // 레벨업시 스텟 증가 시키기
    const statsInfo = dungeon.setUserStats(playerId);

    const payload = {
      playerId,
      statInfo: statsInfo,
    };

    const response = createResponse(PACKET_ID.S_LevelUp, payload);

    const allUsers = dungeon.getAllUsers();

    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default levelUpNotification;
