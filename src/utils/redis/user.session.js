import User from '../../classes/model/userClass.js';
import redis from './redisManager.js';

const addUser = async (socket, id, myClass, nickName) => {
  socket.id = id;

  const user = new User(id, myClass, nickName);
  //const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

  const userKey = `user:${user.id}`;
  await redis.hmset(userKey, {
    socket,
    id: user.id,
    nickName,
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

const getAllUsers = async () => {
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
    console.error('모든 유저 불러오기 오류: ', err);
    throw err;
  }
};

export { addUser, removeUser, getUserById, getAllUsers };
