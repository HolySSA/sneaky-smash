import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getUserById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const attributeHandlers = {
  curHp: (dungeon, socketId, value) => dungeon.updatePlayerHp(socketId, value),
  atk: (dungeon, socketId, value) => dungeon.updatePlayerAtk(socketId, value),
  def: (dungeon, socketId, value) => dungeon.updatePlayerDef(socketId, value),
  maxHp: (dungeon, socketId, value) => dungeon.updatePlayerMaxHp(socketId, value),
  moveSpeed: (dungeon, socketId, value) => dungeon.updatePlayerMoveSpeed(socketId, value),
  criticalProbability: (dungeon, socketId, value) =>
    dungeon.updatePlayerCriticalProbability(socketId, value),
  criticalDamageRate: (dungeon, socketId, value) =>
    dungeon.updatePlayerCriticalDamageRate(socketId, value),
};

const useItemHandler = async ({ socket, payload }) => {
  try {
    const { itemId, itemInstanceId } = payload;

    // 아이템 에셋 가져와서 id를 통해 아이템 정보 가져오기
    const itemAssets = getGameAssets().item;
    const item = itemAssets[itemId];

    const playerId = socket.id;
    // 유저가 속한 던전 세션 가져오기
    const userBySession = getUserById(playerId);
    if (!userBySession) {
      logger.error(`useItemHandler. Could not found user : ${playerId}`);
      return;
    }

    if (!userBySession.dungeonId) {
      logger.error(`useItemHandler. this player not in the dungeon : ${playerId}`);
      return;
    }

    const dungeon = getDungeonSession(userBySession.dungeonId);
    const droppedItem = dungeon.getDroppedObject(playerId, itemId, itemInstanceId);

    if (!droppedItem) {
      return;
    }

    const allUsers = dungeon.getDungeonUsersUUID();
    const itemInfo = {};
    // 아이템 정보에 맞는 스텟 증가를 적용시키기
    Object.entries(item).forEach(([key, value]) => {
      if (attributeHandlers[key]) {
        itemInfo[key] = attributeHandlers[key](dungeon, socket.id, value); // 해당 속성 처리
      }
    });
    const stats = dungeon.getUserStats(playerId).stats;

    const useItemPayload = {
      playerId: socket.id,
      itemInfo: {
        itemId,
        stats,
      },
      itemInstanceId,
    };

    console.log();

    createNotificationPacket(PACKET_ID.S_UseItem, useItemPayload, allUsers);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useItemHandler;
