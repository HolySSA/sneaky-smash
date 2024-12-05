import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession, removeDungeonSession } from '../../sessions/dungeon.session.js';

// message C_LeaveDungeon {
//   // 던전에서 나가기 요청
// }

// 패킷명세
// 던전에서 나가는 응답 (S_LeaveDungeon)
// message S_LeaveDungeon {
//     int32 playerId = 1;          // 던전에서 나간 플레이어 ID
//   }

const leaveDungeonHandler = async (socket, payload) => {
  try {
    const playerId = socket.id;
    const redisUser = await getRedisUserById(playerId);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    // 던전에서 유저 제거
    dungeon.removeDungeonUser(playerId);

    const response = createResponse(PACKET_ID.S_LeaveDungeon, { playerId });

    // 클라이언트에서 나가기 처리를 따로 실시하면 내 유저 ID 제외하고 보내면 된다.
    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveDungeonHandler;
