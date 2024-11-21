import redis from '../../utils/redis/redisManager.js';

const addRedisUser = async (user) => {
  const userKey = `user:${user.id}`;
  const redisUser = await redis.hmset(userKey, {
    id: user.id,
    nickname: user.nickname,
    myClass: user.myClass,
    locationType: user.locationType,
  });

  return redisUser;
};

const removeRedisUser = async (socket) => {
  const keys = await redis.keys('user:*');

  for (const key of keys) {
    const user = await redis.hgetall(key);

    if (Number(user.id) === socket.id) {
      // 인덱스 삭제
      await redis.del(key);

      return user;
    }
  }

  return null;
};

const getRedisUsers = async () => {
  try {
    const userKeys = await redis.keys('user:*');

    const users = await Promise.all(
      userKeys.map(async (key) => {
        const user = await redis.hgetall(key);
        return user;
      }),
    );

    return users;
  } catch (err) {
    console.error('모든 유저 불러오기(레디스) 오류: ', err);
    throw err;
  }
};

const getRedisUserById = async (id) => {
  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);

  return Object.keys(user).length > 0 ? user : null;
};

export { addRedisUser, removeRedisUser, getRedisUsers, getRedisUserById };
