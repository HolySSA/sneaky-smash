import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisUsers } from '../../sessions/redis/redis.user.js';
import { getUserSessions, getUserTransformById } from '../../sessions/user.session.js';
import createNotificationPacket from '../notification/createNotification.js';
import createResponse from '../response/createResponse.js';

const enterLogic = async (socket, userSession) => {
  const playerPayload = {
    playerId: userSession.id,
    nickname: userSession.nickname,
    class: userSession.myClass,
    transform: getUserTransformById(userSession.id),
  };

  const response = createResponse(PACKET_ID.S_Enter, { player: playerPayload });
  socket.write(response);

  const users = await getRedisUsers();
  const userSessions = getUserSessions();

  for (const [key, value] of userSessions) {
    const otherUserPayload = {
      players: users
        .filter((player) => player.id !== key)
        .map((player) => ({
          playerId: player.id,
          nickname: player.nickname,
          class: player.myClass,
          transform: getUserTransformById(player.id),
        })),
    };

    const otherUsernotification = createNotificationPacket(PACKET_ID.S_Spawn, otherUserPayload);
    value.socket.write(otherUsernotification);
  }
};

export default enterLogic;
