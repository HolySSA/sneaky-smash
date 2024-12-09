import { PACKET_ID } from '../../../../configs/constants/packetId.js';
import { getRedisUserById, getRedisUsers } from '../../../../sessions/redis/redis.user.js';
import {
  getUserSessionById,
  getUserSessions,
  getUserTransformById,
} from '../../../../sessions/user.session.js';
import createNotificationPacket from '../../../notification/createNotification.js';
import createResponse from '../../../packet/createResponse.js';
import { enterQueue } from '../queues.js';
import logger from '../../../logger.js';

enterQueue.process(async (job) => {
  const { socketId } = job.data;

  try {
    const userRedis = await getRedisUserById(socketId);
    const userSession = getUserSessionById(socketId);

    const playerPayload = {
      playerId: parseInt(socketId),
      nickname: userRedis.nickname,
      class: userRedis.myClass,
      transform: getUserTransformById(userRedis.id),
    };

    // 접속한 유저에게 응답
    const response = createResponse(PACKET_ID.S_Enter, { player: playerPayload });
    userSession.socket.write(response);

    const users = await getRedisUsers();
    const userSessions = getUserSessions();

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

    // Sleep 함수 - 1초 대기 후 실행
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(1000);

    userSessions.forEach((u) => {
      const chatPayload = {
        playerId: userRedis.id,
        chatMsg: `${userRedis.nickname}님이 게임에 입장하셨습니다!`,
      };

      u.socket.write(createResponse(PACKET_ID.S_Chat, chatPayload));
    });

    return { success: true };
  } catch (err) {
    logger.error('Enter Queue Process 에러: ', err);
    return { success: false };
  }
});
