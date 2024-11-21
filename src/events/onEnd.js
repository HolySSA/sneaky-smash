import { removeRedisUser } from '../sessions/redis/redis.user.js';
import { removeUserSession } from '../sessions/user.session.js';

const onEnd = (socket) => async () => {
  await removeUserSession(socket);
  await removeRedisUser(socket);
};

export default onEnd;
