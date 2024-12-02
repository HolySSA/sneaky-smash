import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';

const attributeHandlers = {
  curHp: (dungeon, socketId, value) => dungeon.recoveryPlayerHp(socketId, value),
  atk: (dungeon, socketId, value) => dungeon.increasePlayerAtk(socketId, value),
  def: (dungeon, socketId, value) => dungeon.increasePlayerDef(socketId, value),
  maxHp: (dungeon, socketId, value) => dungeon.increasePlayerMaxHp(socketId, value),
  moveSpeed: (dungeon, socketId, value) => dungeon.increasePlayerMoveSpeed(socketId, value),
  criticalProbability: (dungeon, socketId, value) => dungeon.increasePlayerCriticalProbability(socketId, value),
  criticalDamageRate: (dungeon, socketId, value) => dungeon.increasePlayerCriticalDamageRate(socketId, value),
};

const useItemHandler = async (socket, payload) => {
  try {
    const { itemId } = payload;

    const gameAssets = getGameAssets();
    const itemAssets = gameAssets.item.data;
    const item = itemAssets.find((item) => item.itemid === itemId);

    const redisUser = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);
    
    const itemInfo = {};

    Object.entries(item).forEach(([key, value]) => {
      if (attributeHandlers[key]) {
        itemInfo[key] = attributeHandlers[key](dungeon, socket.id, value); // 해당 속성 처리
      }
    });

    const useItemPayload = {
      playerId,
      itemInfo,
    };

    const response = createResponse(PACKET_ID.S_UseItem, useItemPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useItemHandler;

// status 레디스 저장 상태동기화가 필요한 정보
//
