import { getGameAssets } from '../../init/loadAsset.js';
import logger from '../../utils/logger.js';
import { getRedis } from '../../utils/redis/redisManager.js';
import { getUserById } from '../user.session.js';
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

export const getStatsByUserId = async (userId) => {
  const userInfo = getUserById(userId);
  const classAssets = getGameAssets().classInfo; // 맵핑된 클래스 데이터 가져오기
  const classInfos = classAssets[userInfo.myClass]; // ID로 직접 접근
  
  if (!classInfos) {
    logger.error(`Class 정보를 찾을 수 없습니다. classId: ${userInfo.myClass}`);
  }

  const expAssets = getGameAssets().expInfo; // 맵핑된 경험치 데이터 가져오기
  const expInfos = expAssets[1]; // 레벨 1의 경험치 정보 접근
  
  if (!expInfos) {
    logger.error('레벨 1의 경험치 정보를 찾을 수 없습니다.');
  }

  return {
    Level : 1,
    stats: classInfos.stats,
    exp: 0,
    maxExp : expInfos.maxExp
  };
};

export const getStatsByUserClass = async (userClass) => {
  const classAssets = getGameAssets().classInfo;
const classInfos = classAssets[userClass];
if (!classInfos) {
  logger.error(`Class 정보를 찾을 수 없습니다. classId: ${userClass}`);
}

const expAssets = getGameAssets().expInfo;
const expInfos = expAssets[1];
if (!expInfos) {
  logger.error('레벨 1의 경험치 정보를 찾을 수 없습니다.');
}
  return {
    Level : 1,
    stats: classInfos.stats,
    exp: 0,
    maxExp : expInfos.maxExp,
  };
};

export const setSessionId = async (userId, sessionId) => {
  const redis = await getRedis();
  const userKey = `user:${userId}`;
  await redis.hset(userKey, 'sessionId', sessionId);
  await redis.expire(userKey, 3600);
};
