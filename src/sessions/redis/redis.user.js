import { getGameAssets } from '../../init/loadAsset.js';
import redis from '../../utils/redis/redisManager.js';

const addRedisUser = async (user) => {
  const userKey = `user:${user.id}`;
  const redisUser = await redis.hset(userKey, {
    id: user.id.toString(),
    nickname: user.nickname,
    myClass: user.myClass.toString(),
    locationType: user.locationType,
    sessionId: 0,
  });

  return redisUser;
};

const removeRedisUser = async (socket) => {
  const userKey = `user:${socket.id}`;
  const user = await redis.hgetall(userKey);

  if (Object.keys(user).length === 0) {
    return null;
  }

  await redis.del(userKey);
  return user;
};

const getRedisUsers = async () => {
  // keys - 데이터 많으면 불안전. 대신 scan 사용으로 변경.
  const userKeys = await redis.keys('user:*');

  if (!userKeys.length) {
    return null;
  }

  // pipeline - 명령 묶어서 실행(최적화)
  const pipeline = redis.pipeline();
  userKeys.forEach((key) => pipeline.hgetall(key));

  const results = await pipeline.exec();

  return results.map(([err, data]) => {
    if (err || !data) return null;
    return {
      id: data.id,
      nickname: data.nickname,
      myClass: parseInt(data.myClass),
      locationType: data.locationType,
      sessionId: data.sessionId,
    };
  });
};

const getRedisUserById = async (id) => {
  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  return {
    id: user.id,
    nickname: user.nickname,
    myClass: parseInt(user.myClass),
    locationType: user.locationType,
    sessionId: user.sessionId,
  };
};

const getStatsByUserId = async (userId) => {
  const userKey = `user:${userId}`;
  const user = await redis.hset(userKey);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  const classId = parseInt(user.myClass);
  const classInfos = getGameAssets().classInfo.data.find(
    (classInfo) => classInfo.classId === classId,
  );

  return classInfos.stats;
};

const setSessionId = async (userId, sessionId) => {
  const userKey = `user:${userId}`;
  const user = await redis.exists(userKey);

  if (!user) {
    throw new Error(`유저 레디스 데이터가 존재하지 않습니다.`);
  }

  await redis.hset(userKey, 'sessionId', sessionId.toString());
};

export {
  addRedisUser,
  removeRedisUser,
  getRedisUsers,
  getRedisUserById,
  getStatsByUserId,
  setSessionId,
};
