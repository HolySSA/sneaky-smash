import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getAllUserUUID, getUserById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getAllUserByTown } from '../../sessions/town.session.js';

const animationHandler = async ({ socket, payload }) => {
  var animationPayload;

  const user = getUserById(socket.id);
  let targetsUUID = null;

  if (user.dungeonId) {
    const dungeon = getDungeonSession(user.dungeonId);
    targetsUUID = dungeon.usersUUID;
  } else {
    targetsUUID = getAllUserByTown();
  }
  const { animCode } = payload;

  animationPayload = {
    playerId: socket.id,
    animCode,
  };

  return new Result(animationPayload, PACKET_ID.S_Animation, targetsUUID);
};

export default animationHandler;
