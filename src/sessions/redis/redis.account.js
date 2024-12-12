import { getRedis } from '../../utils/redis/redisManager.js';
import { tryGetValue } from './helper.js';
const ACCOUNT_KEY = 'account';

export const getAccountByRedis = async (account) => {
  const redis = await getRedis();
  const key = `${ACCOUNT_KEY}:${account}`;
  return tryGetValue(await redis.hgetall(key));
};

export const setTokenByRedis = async (account, token) => {
  const redis = await getRedis();
  const key = `${ACCOUNT_KEY}:${account}`;
  await redis.hset(key, 'token', token);
  await redis.expire(key, 3600);
};

export const setAccountByRedis = async (accountByDB) => {
  const redis = await getRedis();
  const key = `${ACCOUNT_KEY}:${accountByDB.account}`;
  await redis.hset(key, accountByDB);
  await redis.expire(key, 3600);
};

export const unlinkAccountByRedis = async (account) => {
  const redis = await getRedis();
  const key = `${ACCOUNT_KEY}:${account}`;
  return await redis.unlink(key);
};
