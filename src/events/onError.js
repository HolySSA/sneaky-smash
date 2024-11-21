import { removeRedisUser } from '../sessions/redis/redis.user.js';
import { removeUserSession } from '../sessions/user.session.js';

const onError = (socket) => async (err) => {
  await removeUserSession(socket);
  await removeRedisUser(socket);

  console.error('Socket error:', err);
};

export default onError;
