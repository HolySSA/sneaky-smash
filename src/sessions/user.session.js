/** 접속된 모든 유저 정보가 보관되고있는 곳. 여기를 통해서 다른 세션에'도' 복사된체로 보관되는 것이므로 일단 로그인 성공시
 * 이곳에 먼저 등록되어야한다.
 */
import User from '../classes/model/user.class.js';
import logger from '../utils/logger.js';
import { userSessions } from './sessions.js';

const allUsersUUID = [];

const addUserSession = (socket) => {
  if (userSessions.has(socket.id)) {
    logger.error('이미 존재하는 유저 세션입니다.');
    return null;
  }

  const user = new User(socket);
  userSessions.set(socket.id, user);
  allUsersUUID.push(socket.UUID);
  return user;
};

const removeUserSession = (socket) => {
  const user = userSessions.get(socket.id);
  if (user) {
    user.dispose();
    userSessions.delete(socket.id);
    const index = allUsersUUID.indexOf(socket.UUID);
    if (index !== -1) {
      allUsersUUID.splice(index, 1);
    }
  }
};

const getAllUserUUID = () => {
  return allUsersUUID;
};

const getUserSessions = () => {
  if (userSessions.size === 0) {
    return null;
  }

  return userSessions;
};

const getUserById = (userId) => {
  return userSessions.get(userId);
};

const getUserTransformById = (userId) => {
  return userSessions.get(userId).transform;
};

const updateUserTransformById = (userId, posX, posY, posZ, rot) => {
  const user = userSessions.get(userId);
  user.updateUserTransform(posX, posY, posZ, rot);

  const transform = { posX, posY, posZ, rot };
  return transform;
};

export {
  addUserSession,
  removeUserSession,
  getUserSessions,
  getUserById,
  getUserTransformById,
  updateUserTransformById,
  getAllUserUUID,
};
