import { getGameAssets } from '../../init/loadAsset.js';
import { getRedis } from '../../utils/redis/redisManager.js';
import { tryGetValue } from './helper.js';

export const addRedisUser = async (userId, nickname, myClass) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;

  const redisUser = await redis.hset(userKey, {
    id: userId,
    nickname: nickname,
    myClass: myClass,
  });

  await redis.expire(userKey, 3600);

  return redisUser;
};

export const setRedisUser = async (characterDB) => {
  const redis = await getRedis();
  const userKey = `user:${characterDB.id}`;
  await redis.hset(userKey, characterDB);
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

export const getStatsByUserId = async (userId) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;
  const user = await redis.hgetall(userKey);

  if (tryGetValue(user) == null) {
    throw new Error('존재하지 않는 레디스 유저입니다.');
  }

  const classId = parseInt(user.myClass);
  const classInfos = getGameAssets().classInfo.data.find(
    (classInfo) => classInfo.classId === classId,
  );

  return {
    stats: classInfos.stats,
    exp: 0,
  };
};

export const setSessionId = async (userId, sessionId) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;
  await redis.hset(userKey, 'sessionId', sessionId);
  await redis.expire(userKey, 3600);
};
