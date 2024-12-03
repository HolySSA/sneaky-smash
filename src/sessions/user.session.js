import User from '../classes/model/user.class.js';
import { userSessions } from './sessions.js';

const addUserSession = (socket) => {
  if (userSessions.has(socket.id)) {
    throw new Error('세션 중복');
  }

  const user = new User(socket);
  userSessions.set(socket.id, user);
  return user;
};

const removeUserSession = async (socket) => {
  if (userSessions.has(socket.id)) {
    userSessions.delete(socket.id);
  }
};

const getUserSessions = () => {
  if (!userSessions || userSessions.size === 0) {
    console.error('유저세션이 없습니다.');
    return null;
  }

  return userSessions;
};

const getUserSessionById = (id) => {
  const userId = id.toString();
  return userSessions.get(userId) || null;
};

const getUserTransformById = (id) => {
  const userId = id.toString();
  if (userSessions.has(userId)) return userSessions.get(userId).transform;

  return { posX: -5, posY: 0.5, posZ: 135, rot: 0 };
};

const updateUserTransformById = (id, posX, posY, posZ, rot) => {
  const newTransform = { posX, posY, posZ, rot };

  const userId = id.toString();

  const user = userSessions.get(userId);
  user.updateUserTransform(posX, posY, posZ, rot);

  return newTransform;
};

export {
  addUserSession,
  removeUserSession,
  getUserSessions,
  getUserSessionById,
  getUserTransformById,
  updateUserTransformById,
};
