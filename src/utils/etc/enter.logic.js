import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisUsers } from '../../sessions/redis/redis.user.js';
import { getUserSessions, getUserTransformById } from '../../sessions/user.session.js';
import createNotificationPacket from '../notification/createNotification.js';
import createResponse from '../response/createResponse.js';

const enterLogic = async (socket, userSession) => {
  const player = {
    playerId: userSession.id,
    nickname: userSession.nickname,
    class: userSession.myClass,
    transform: getUserTransformById(userSession.id),
  };

  const response = createResponse(PACKET_ID.S_Enter, { player });
  socket.write(response);

  const allUsers = await getRedisUsers();

  const otherUserPayload = {
    players: allUsers
      .filter((player) => player.id !== socket.id)
      .map((player) => ({
        playerId: player.id,
        nickname: player.nickname,
        class: player.myClass,
        transform: getUserTransformById(player.id),
      })),
  };

  // 해당 유저에게는 다른 유저 정보를 S_Spawn으로 전달.
  const notification = createNotificationPacket(PACKET_ID.S_Spawn, otherUserPayload);
  socket.write(notification);

  // 다른 유저에게는 나의 정보를 S_Spawn으로 전달.
  const sessions = await getUserSessions();
  const anotherUsernotification = createNotificationPacket(PACKET_ID.S_Spawn, { player });

  sessions.forEach((session) => {
    if (session.socket !== socket) {
      session.socket.write(anotherUsernotification);
    }
  });
};

export default enterLogic;
