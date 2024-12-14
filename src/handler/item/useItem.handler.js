import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';

const attributeHandlers = {
  curHp: (dungeon, socketId, value) => dungeon.updatePlayerHp(socketId, value),
  atk: (dungeon, socketId, value) => dungeon.increasePlayerAtk(socketId, value),
  def: (dungeon, socketId, value) => dungeon.increasePlayerDef(socketId, value),
  maxHp: (dungeon, socketId, value) => dungeon.increasePlayerMaxHp(socketId, value),
  moveSpeed: (dungeon, socketId, value) => dungeon.increasePlayerMoveSpeed(socketId, value),
  criticalProbability: (dungeon, socketId, value) =>
    dungeon.increasePlayerCriticalProbability(socketId, value),
  criticalDamageRate: (dungeon, socketId, value) =>
    dungeon.increasePlayerCriticalDamageRate(socketId, value),
};

const useItemHandler = async ({socket, payload}) => {
  try {
    const { itemId, itemInstanceId } = payload;

    // 아이템 에셋 가져와서 id를 통해 아이템 정보 가져오기
    const itemAssets = getGameAssets().item;
    const item = itemAssets[itemId];

    // 유저가 속한 던전 세션 가져오기
    const redisUser = await findCharacterByUserId(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    const itemInfo = {};
    // 아이템 정보에 맞는 스텟 증가를 적용시키기
    Object.entries(item).forEach(([key, value]) => {
      if (attributeHandlers[key]) {
        itemInfo[key] = attributeHandlers[key](dungeon, socket.id, value); // 해당 속성 처리
      }
    });
    // 체력 상태 동기화를 위한 유저의 체력 정보 가져오기
    const user = dungeon.getDungeonUser(socket.id);
    const currentHp = user.currentHp;

    const useItemPayload = {
      playerId: socket.id,
      itemInfo: {
        itemId,
        stats: itemInfo,
      },
      itemInstanceId,
    };

    const updatePlayerHpResponse = createResponse(PACKET_ID.S_UpdatePlayerHp, {
      playerId: socket.id,
      hp: currentHp,
    });

    allUsers.forEach((value) => {
      value.socket.write(updatePlayerHpResponse);
    });

    const response = createResponse(PACKET_ID.S_UseItem, useItemPayload);
    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (e) {
    handleError(socket, e);
  }
};
export default useItemHandler;
