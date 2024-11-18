import { removeUser } from '../utils/redis/user.session.js';

const onError = (socket) => async (err) => {
  await removeUser(socket);
  console.error('Socket error:', err);
};

export default onError;
