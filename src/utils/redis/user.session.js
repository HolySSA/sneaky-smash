import User from '../../classes/model/user.class.js';
import redis from './redisManager.js';

const addUser = async (socket, id, myClass, nickName) => {
  socket.id = id;

  const user = new User(id, myClass, nickName);
  //const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

  const userKey = `user:${user.id}`;
  await redis.hmset(userKey, {
    id: user.id,
  });

  return user;
};

const removeUser = async (socket) => {
  const keys = await redis.keys('user:*');

  for (const key of keys) {
    const user = await redis.hgetall(key);

    // console.log('user.id: ', user.id);
    // console.log('socket.id: ', socket.id);
    // const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

    if (Number(user.id) === socket.id) {
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
