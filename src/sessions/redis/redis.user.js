import { getRedis } from '../../utils/redis/redisManager.js';
import { tryGetValue } from './helper.js';

export const setRedisUser = async (characterDB) => {
  const redis = await getRedis();
  const userKey = `user:${characterDB.userId}`;
  await redis.hset(userKey, characterDB);
  await redis.expire(userKey, 3600);
};

export const setRedisUserUUID = async (socket) => {
  const redis = await getRedis();
  const userKey = `user:${socket.id}`;
  await redis.hset(userKey, 'UUID', socket.UUID);
  await redis.expire(userKey, 3600);
};

export const removeRedisUser = async (socket) => {
  const redis = await getRedis();
  const userKey = `user:${socket.id}`;
  return await redis.unlink(userKey);
};

export const getRedisUserById = async (id) => {
  const redis = await getRedis();
  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);
  return tryGetValue(user);
};

export const setSessionId = async (userId, sessionId) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;
  await redis.hset(userKey, 'sessionId', sessionId);
  await redis.expire(userKey, 3600);
};
