import { getGameAssets } from '../../init/loadAsset.js';
import { getRedis } from '../../utils/redis/redisManager.js';
import { tryGetValue } from './helper.js';

const addRedisUser = async (userId, nickname, myClass) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;

  const redisUser = await redis.hset(userKey, {
    id: userId,
    nickname: nickname,
    myClass: myClass,
    locationType: 'town',
  });

  return redisUser;
};

const removeRedisUser = async (socket) => {
  const redis = await getRedis();
  const userKey = `user:${socket.id}`;
  return await redis.unlink(userKey);
};

const getRedisUsers = async () => {
  const redis = await getRedis();
  // keys 명령어로 직접 조회
  const userKeys = await redis.keys('user:*');

  if (!userKeys.length) {
    return [];
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
  const redis = await getRedis();
  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);
  return tryGetValue(user);
};

const getStatsByUserId = async (userId) => {
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

const setSessionId = async (userId, sessionId) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;
  await redis.hset(userKey, 'sessionId', sessionId);
};

export {
  addRedisUser,
  removeRedisUser,
  getRedisUsers,
  getRedisUserById,
  getStatsByUserId,
  setSessionId,
};
