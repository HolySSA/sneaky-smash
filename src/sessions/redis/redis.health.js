import { getRedis } from '../../utils/redis/redisManager.js';
import configs from '../../configs/configs.js';
import { getAllUserUUID } from '../user.session.js';

const { SERVER_MAX_CAPACITY, ServerUUID, SERVER_NAME, SERVER_PORT } = configs;
const HEALTH_REPORT_CHANEL = 'GAME_SERVER_HEALTH_REPORT_CHANNEL';

export const startHealthReport = async () => {
  const redis = await getRedis();

  await redis.publish(
    `${HEALTH_REPORT_CHANEL}:${ServerUUID}`,
    JSON.stringify({
      serverName: SERVER_NAME,
      maxCapacity: SERVER_MAX_CAPACITY,
      currentUserCount: getAllUserUUID().length,
      port: SERVER_PORT,
    }),
  );

  setInterval(async () => {
    await redis.publish(
      `${HEALTH_REPORT_CHANEL}:${ServerUUID}`,
      JSON.stringify({
        serverName: SERVER_NAME,
        maxCapacity: SERVER_MAX_CAPACITY,
        currentUserCount: getAllUserUUID().length,
        port: SERVER_PORT,
      }),
    );
  }, 3000);
};
