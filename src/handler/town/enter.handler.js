import handleError from '../../utils/error/errorHandler.js';
import { createCharacter, findCharacterByUserId } from '../../db/model/characters.db.js';
import { addRedisUser, getRedisUserById } from '../../sessions/redis/redis.user.js';
import { addUserSession } from '../../sessions/user.session.js';
import enterLogic from '../../utils/etc/enter.logic.js';

const enterHandler = async ({ socket, payload }) => {
  try {
    //  addUserSession(socket);
    console.log(`SocketID : ${socket.id}`);

    const nickname = payload.nickname;
    const userClass = payload.class;

    const character = await findCharacterByUserId(parseInt(socket.id));
    if (character == null) {
      // sql에서 gold default 선언해서 만들면 gold 입력 빼도 됨
      await createCharacter(parseInt(socket.id), nickname, userClass, 0);
    }
    await enterLogic(socket, { id: socket.id, nickname, myClass: userClass });
  } catch (e) {
    handleError(socket, e);
  }
};

export default enterHandler;
