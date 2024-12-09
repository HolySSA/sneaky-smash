import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/packet/createResponse.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';

const updateNexusHpNotification = async (socket, hp) => {
  try {
    const redisUser = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    const response = createResponse(PACKET_ID.S_UpdateNexusHp, { hp });

    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default updateNexusHpNotification;
