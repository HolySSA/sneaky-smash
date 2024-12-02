import { userSessions } from './sessions.js';

const addUserSession = (socket, user) => {
  if (userSessions.has(socket.id)) {
    throw new Error('세션 중복');
  }

  userSessions.set(socket.id, { socket, transform: user.transform, inventory: [] });
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
    return;
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
  const session = userSessions.get(userId);
  if (session) session.transform = newTransform;

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
