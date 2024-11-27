import { PACKET_ID } from '../../../../constants/packetId.js';
import { getRedisUserById, getRedisUsers } from '../../../../sessions/redis/redis.user.js';
import {
  getUserSessionById,
  getUserSessions,
  getUserTransformById,
} from '../../../../sessions/user.session.js';
import createNotificationPacket from '../../../notification/createNotification.js';
import createResponse from '../../../response/createResponse.js';
import { enterQueue } from '../queues.js';

enterQueue.process(async (job) => {
  const { socketId, user } = job.data;

  try {
    const userSession = getUserSessionById(socketId);

    const playerPayload = {
      playerId: user.id,
      nickname: user.nickname,
      class: user.myClass,
      transform: getUserTransformById(user.id),
    };

    // 접속한 유저에게 응답
    const response = createResponse(PACKET_ID.S_Enter, { player: playerPayload });
    userSession.socket.write(response);

    // 다른 유저들에게 새로운 유저 알림
    const users = await getRedisUsers();
    const userSessions = getUserSessions();

    for (const [key, value] of userSessions) {
      console.log(`Key: ${key} `);
    }

    // 해당 유저에게는 다른 유저 정보를 S_Spawn으로 전달.
    const otherUserPayload = {
      players: users
        .filter((player) => player.id !== socketId)
        .map((player) => ({
          playerId: parseInt(player.id),
          nickname: player.nickname,
          class: player.myClass,
          transform: getUserTransformById(player.id),
        })),
    };

    if (otherUserPayload.players.length > 0) {
      const notification = createNotificationPacket(PACKET_ID.S_Spawn, otherUserPayload);
      userSession.socket.write(notification);
    }

    const userNotification = createNotificationPacket(PACKET_ID.S_Spawn, {
      players: [playerPayload],
    });

    userSessions.forEach((u) => {
      if (u.socket.id !== socketId) {
        u.socket.write(userNotification);
      }
    });

    //================================================================================================

    userSessions.forEach((u) => {
      const chatPayload = {
        playerId: user.id,
        chatMsg: `${user.nickname}님이 게임에 입장하셨습니다!`,
      };

      u.socket.write(createResponse(PACKET_ID.S_Chat, chatPayload));
    });

    return { success: true };
  } catch (err) {
    console.error('Enter Queue Process 에러: ', err);
    return { success: false };
  }
});
