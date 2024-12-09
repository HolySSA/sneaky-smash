import createResponse from '../../utils/packet/createResponse.js';
import handleError from '../../utils/error/errorHandler.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import updateNexusHpNotification from './updateNexusHp.notification.js';

// message C_AttackedNexus {
//     int32 damage = 1;    // 데미지
//   }
//   message S_AttackedNexus {
//     int32 playerId = 1;  // 공격 유저ID
//     int32 damage = 2;    // 데미지
//   }

const attackedNexusHandler = async (socket, payload) => {
  try {
    const { damage } = payload;
    const playerId = socket.id;

    const response = createResponse(PACKET_ID.S_AttackedNexus, { playerId, damage });

    const redisUser = await getRedisUserById(playerId);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    const currentHp = dungeon.nexusDamaged(damage);

    updateNexusHpNotification(socket, currentHp);

    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default attackedNexusHandler;
