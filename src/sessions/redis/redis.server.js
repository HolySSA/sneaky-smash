import { getRedis } from '../../utils/redis/redisManager.js';
import configs from '../../configs/configs.js';

const { ServerUUID } = configs;
const SERVER_LIST_KEY = 'ServerList';
/**
 * 서버 등록 및 인덱스 반환
 */
export const registServerAndGetIndex = async () => {
  const redis = await getRedis();

  const list = await redis.lrange(SERVER_LIST_KEY, 0, -1);

  let index = list.indexOf('');
  if (index === -1) {
    index = (await redis.rpush(SERVER_LIST_KEY, ServerUUID)) - 1;
  } else {
    await redis.lset(SERVER_LIST_KEY, index, ServerUUID);
  }

  return index;
};

/**
 * 서버 등록 해제
 */
export const unregistServer = async () => {
  const redis = await getRedis();

  const list = await redis.lrange(SERVER_LIST_KEY, 0, -1);
  const index = list.indexOf(ServerUUID);
  if (index !== -1) {
    await redis.lset(SERVER_LIST_KEY, index, '');
  }
};
