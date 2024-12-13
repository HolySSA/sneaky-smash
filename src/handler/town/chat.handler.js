import handleError from '../../utils/error/errorHandler.js';
import { getUserById } from '../../sessions/user.session.js';
import { pubChat } from '../../sessions/redis/redis.chat.js';
import { getUserSessionByIdFromTown } from '../../sessions/town.session.js';
import { findDungeonByUserId, getDungeonSession } from '../../sessions/dungeon.session.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import configs from '../../configs/configs.js';

const chatHandler = async ({ socket, payload }) => {
  try {
    const { chatMsg } = payload;
    const isTownUser = getUserSessionByIdFromTown(socket.id);
    const nickname = getUserById(socket.id).nickname;
    if (isTownUser) {
      await pubChat(socket.id, nickname, chatMsg);
    } else {
      const user = getUserById(socket.id);
      const dungeon = getDungeonSession(user.dungeonId);
      if (dungeon) {
        createNotificationPacket(
          PACKET_ID.S_Chat,
          { playerId: socket.id, nickname, chatMsg, serverIndex: configs.ServerIndex },
          dungeon.usersUUID,
        );
      } else {
        logger.error(
          `chatHandler. ${socket.id}에서 던전에 없는데 던전 채팅 보냄 : ${user.dungeonId}`,
        );
      }
    }
  } catch (e) {
    handleError(socket, e);
  }
};

export default chatHandler;
