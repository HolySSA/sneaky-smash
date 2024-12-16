import { getUserById } from '../../sessions/user.session.js';

const pongHandler = async ({ socket, payload }) => {
  const { clientTime } = payload;
  const user = getUserById(socket.id);
  user.handlePong(clientTime);
};

export default pongHandler;
