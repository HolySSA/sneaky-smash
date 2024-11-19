import User from '../../classes/model/userClass.js';
import redis from './redisManager.js';

const addUser = async (socket, id, account) => {
  const user = new User(id, account);
  const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

  const userKey = `user:${user.id}`;
  await redis.hmset(userKey, {
    id: user.id,
    account: user.account,
    clientId: clientId,
  });

  return user;
};

const removeUser = async (socket) => {
  const keys = await redis.keys('user:*');

  for (const key of keys) {
    const user = await redis.hgetall(key);

    // console.log('socket: ', JSON.stringify(socket));

    const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
    if (user.clientId === clientId) {
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

  return Object.keys(user).length > 0 ? user : null;
};

export { addUser, removeUser, getUserById };
