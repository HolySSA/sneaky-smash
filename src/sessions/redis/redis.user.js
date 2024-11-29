import { getGameAssets } from '../../init/loadAsset.js';
import redis from '../../utils/redis/redisManager.js';

const addRedisUser = async (userId, nickname, myClass) => {
  const userKey = `user:${userId}`;

  const existingUser = await redis.exists(userKey);
  if (existingUser) {
    throw new Error('이미 존재하는 레디스 유저입니다.');
  }

  const redisUser = await redis.hset(userKey, {
    id: userId.toString(),
    nickname: nickname,
    myClass: myClass.toString(),
    locationType: 'town',
  });

  return redisUser;
};

const removeRedisUser = async (socket) => {
  const userKey = `user:${socket.id}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    throw new Error('존재하지 않는 레디스 유저입니다.');
  }

  await redis.del(userKey);
  return user;
};

const getRedisUsers = async () => {
  // keys - 데이터 많으면 불안전. 대신 scan 사용으로 변경.
  const userKeys = await redis.keys('user:*');

  if (!userKeys.length) {
    throw new Error('레디스 유저가 존재하지 않습니다.');
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
    };
  });
};

const getRedisUserById = async (id) => {
  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    throw new Error('존재하지 않는 레디스 유저입니다.');
  }

  return {
    id: user.id,
    nickname: user.nickname,
    myClass: parseInt(user.myClass),
    locationType: user.locationType,
  };
};

const getStatsByUserId = async (userId) => {
  const userKey = `user:${userId}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    throw new Error('존재하지 않는 레디스 유저입니다.');
  }

  const classId = parseInt(user.myClass);
  const classInfos = getGameAssets().classInfo.data.find(
    (classInfo) => classInfo.classId === classId,
  );

  return classInfos.stats;
};

export { addRedisUser, removeRedisUser, getRedisUsers, getRedisUserById, getStatsByUserId };
