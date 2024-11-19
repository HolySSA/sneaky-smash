import { removeUser } from '../utils/redis/user.session.js';

const onEnd = (socket) => async () => {
  await removeUser(socket);
};

export default onEnd;
