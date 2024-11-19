const gameSession = [];
const addGameSession = (sessionId) => {
  const session = {
    id: sessionId,
    users: [],
  };
  gameSessions.push(session);
  return session;
};
const getGameSessionById = (sessionId) => {
  return gameSession.find((session) => session.id === sessionId);
};
const addUserToSession = (sessionId, user) => {
  const session = getGameSessionById(sessionId);
  if (!session) {
    throw new Error('세션미아');
  }
  session.users.push(user);
};
const getAllUsersFromSession = (sessionId) => {
  const session = getGameSessionById(sessionId);
  if (!session) {
    throw new Error('세션미아2');
    return session.users;
  }
};

export default addGameSession;
