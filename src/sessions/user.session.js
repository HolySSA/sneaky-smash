const userSessions = new Map();

const addUserSession = async (socket, user) => {
  if (userSessions.has(socket.id)) {
    throw new Error('세션 중복');
  }

  userSessions.set(id, { socket, transform: user.transform });

  return user;
};

const removeUserSession = async (socket) => {
  if (userSessions.has(socket.id)) {
    userSessions.delete(socket.id);
  }
};

const getUserSessions = () => {
  return userSessions;
};

const getUserSessionById = (id) => {
  return userSessions.get(id) || null;
};

const getUserTransformById = (id) => {
  if (userSessions.has(id)) return userSessions.get(id).transform;

  return { posX: -5, posY: 0.5, posZ: 135, rot: 0 };
};

const updateUserTransformById = (id, posX, posY, posZ, rot) => {
  const newTransform = { posX, posY, posZ, rot };

  const session = userSessions.get(id);
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
