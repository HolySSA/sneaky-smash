import User from '../classes/model/user.class.js';
import logger from '../utils/logger.js';
import { townSessions } from './sessions.js';
const allUsersUUID = [];

const addUserForTown = (user) => {
  if (townSessions.has(user.id)) {
    throw new Error('이미 존재하는 유저 세션입니다.');
  }
  townSessions.set(user.id, user);
  allUsersUUID.push(user.socket.UUID);
  return user;
};

/**
 *
 * @param {string} userId  socket.id 혹은 db의 user.id
 */
const removeUserForTown = (userId) => {
  const user = getUserSessionByIdFromTown(userId);
  if (user) {
    townSessions.delete(user.id);
    const index = allUsersUUID.indexOf(user.socket.UUID);
    if (index !== -1) {
      allUsersUUID.splice(index, 1);
    }
  }
};

const getAllUserUUIDByTown = () => {
  return allUsersUUID;
};

const getUserSessionByIdFromTown = (userId) => {
  return townSessions.get(userId);
};

const getAllUserByTown = () => {
  return townSessions;
};

const getUserTransformById = (userId) => {
  if (!townSessions.has(userId)) {
    throw new Error('존재하지 않는 유저 세션입니다.');
  }

  return townSessions.get(userId).transform;
};

const updateUserTransformById = (userId, posX, posY, posZ, rot) => {
  if (!townSessions.has(userId)) {
    throw new Error('존재하지 않는 유저 세션입니다.');
  }

  const user = townSessions.get(userId);
  user.updateUserTransform(posX, posY, posZ, rot);

  const transform = { posX, posY, posZ, rot };
  return transform;
};

export {
  addUserForTown,
  removeUserForTown,
  getUserSessionByIdFromTown,
  getUserTransformById,
  updateUserTransformById,
  getAllUserUUIDByTown,
  getAllUserByTown,
};
