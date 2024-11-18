const userSession = [];

/**
 *
 * @param {object} socket 클라이언트 소켓
 * @returns {object|null} 사용자 객체
 */

export const getUserBySocket = (socket) => {
  return userSession.find((user) => user.socket === socket) || null;
};

export const addUser = (user) => {
  userSession.push(user);
};
