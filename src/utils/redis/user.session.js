import User from '../../classes/model/userClass.js';
import redis from './redisManager.js';

const addUser = async (id, account) => {
  // const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
  socket.account = account;
  const user = new User(id, account);

  const userKey = `user:${user.id}`;
  await redis.hmset(userKey, {
    id: user.id,
    account: user.account,
  });

  return user;
};

const removeUser = async (socket) => {
  const keys = await redis.keys('user:*');

  for (const key of keys) {
    const user = await redis.hgetall(key);

    // 소켓으로 해당 유저 찾기가 안됨 - account나 id로 교체
    // console.log('socket: ', JSON.stringify(socket));

    console.log('user.account: ', user.account);
    console.log('socket.account: ', socket.account);

    if (socket.account && user.account === socket.account) {
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
