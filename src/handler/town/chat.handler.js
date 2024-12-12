import handleError from '../../utils/error/errorHandler.js';
import { getUserById } from '../../sessions/user.session.js';
import { pubChat } from '../../sessions/redis/redis.chat.js';

const chatHandler = async ({ socket, payload }) => {
  try {
    const { chatMsg } = payload;
    const nickname = getUserById(socket.id).nickname;
    await pubChat(nickname, chatMsg);
  } catch (e) {
    handleError(socket, e);
  }
};

export default chatHandler;
