import User from '../../classes/model/userClass.js';
import redis from './redisManager.js';

const addUser = async (socket, id, account) => {
  const user = new User(socket, id, account);

  const userKey = `user:${user.id}`;
  await redis.hmset(userKey, {
    id: user.id,
    socket: user.socket,
    account: user.account,
  });

  // 보조 인덱스 account => id 매핑
  await redis.set(`account:${user.account}`, user.id);

  return user;
};

const removeUser = async (socket) => {
  const keys = await redis.keys('user:*');

  for (const key of keys) {
    const user = await redis.hgetall(key);

    // 소켓으로 해당 유저 찾기가 안됨 - account나 id로 교체
    console.log('socket: ', JSON.stringify(socket));

    if (user.socket === socket) {
      // 보조 인덱스 삭제
      await redis.del(`account:${user.account}`);
      // 인덱스 삭제
      await redis.del(key);

      return user;
    }
  }

  return null;
};

const getUserById = async (id) => {
  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);

  return user || null;
};

const getUserByAccount = async (account) => {
  const id = await redis.get(`account:${account}`);
  if (!id) {
    return null;
  }

  const userKey = `user:${id}`;
  const user = await redis.hgetall(userKey);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  return user;
};

export { addUser, removeUser, getUserById, getUserByAccount };
