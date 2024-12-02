// message S_UpdatePlayerHp {
//     int32 playerId = 1; // 플레이어 식별 ID
//     float hp = 2;       // 플레이어의 체력

import createResponse from '../../utils/response/createResponse.js';
import handleError from '../../utils/error/errorHandler.js';
import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';

const updatePlayerHpNotification = async (socket, payload) => {
  try {
    const { playerId, hp } = payload;

    const response = createResponse(PACKET_ID.S_UpdatePlayerHp, { playerId, hp });

    const redisUser = await getRedisUserById(playerId);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    allUsers.forEach((value) => {
        value.socket.write(response);
    })

  } catch (err) {
    handleError(err);
  }
};

export default updatePlayerHpNotification;
