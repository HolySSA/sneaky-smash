import { getGameAssets } from '../../init/loadAsset.js';
import redis from '../../utils/redis/redisManager.js';
import logger from '../../utils/logger.js';

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
  // keys 명령어로 직접 조회
  const userKeys = await redis.keys('user:*');
  logger.info('Redis 유저 키 조회 결과:', userKeys);

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
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
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

const setStatsByUserId = async (userId, statInfo) => {
  const userKey = `user:${userId}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    throw new Error('유저가 존재하지 않습니다.');
  }

  // StatInfo 메시지 형식 검증
  const StatInfo = {
    stats: {
      level: statInfo.stats.level + 1,
      atk: statInfo.stats.atk + statInfo.level * 2,
      def: statInfo.stats.def + statInfo.level * 1,
      curHp: statInfo.stats.curHp + statInfo.level * 10,
      maxHp: statInfo.stats.maxHp + statInfo.level * 20,
      moveSpeed: statInfo.stats.moveSpeed,
      criticalProbability: statInfo.stats.criticalProbability,
      criticalDamageRate: statInfo.stats.criticalDamageRate,
    },
    exp: statInfo.exp,
  };

  // Redis에 스탯 정보 저장
  await redis.hset(userKey, {
    stats: JSON.stringify(StatInfo),
  });

  return StatInfo;
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
  setStatsByUserId,
};
