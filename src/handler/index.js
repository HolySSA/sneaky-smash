import { PACKET_ID } from '../constants/packetId.js';
import CustomError from '../utils/error/customError.js';
import ErrorCodes from '../utils/error/errorCodes.js';
import leaveDungeonHandler from './battle/leaveDungeon.handler.js';
import monsterActionHandler from './battle/monsterAction.handler.js';
import bossSpawnHandler from './boss/bossSpawn.handler.js';
import targetPlayerHandler from './boss/targetPlayer.handler.js';
import enterPotalHandler from './game/enterPortal.handler.js';
import inventoryHandler from './game/inventory.handler.js';
import useSkillHandler from './game/useSkill.handler.js';
import dropItemHandler from './item/dropItem.handler.js';
import equipEquipmentHandler from './item/equipEquipment.handler.js';
import getItemHandler from './item/getItem.handler.js';
import purchaseItemHandler from './item/purchaseItem.handler.js';
import sellItemHandler from './item/sellItme.handler.js';
import unequipWeaponHandler from './item/unequipWeapon.handler.js';
import useItemHandler from './item/useItem.handler.js';
import monsterDamageHandler from './monster/monsterDamage.handler.js';
import monsterKillHandler from './monster/monsterKill.handler.js';
import monsterMoveHandler from './monster/monsterMove.handler.js';
import monsterSpawnHandler from './monster/monsterSpawn.handler.js';
import partyHandler from './party/party.handler.js';
import animationHandler from './town/animation.handler.js';
import chatHandler from './town/chat.handler.js';
import enterHandler from './town/enter.handler.js';
import { movePlayerHandler } from './town/move.player.handler.js';
import logInHandler from './user/logIn.handler.js';
import registerHandler from './user/register.handler.js';

const handlers = {
  [PACKET_ID.C_Register]: {
    handler: registerHandler,
  },
  [PACKET_ID.C_LogIn]: {
    handler: logInHandler,
  },
  // battle
  [PACKET_ID.C_LeaveDungeon]: {
    handler: leaveDungeonHandler,
  },
  [PACKET_ID.C_MonsterAction]: {
    handler: monsterActionHandler,
  },
  // boss
  [PACKET_ID.C_BossSpawn]: {
    handler: bossSpawnHandler,
  },
  [PACKET_ID.C_TargetPlayer]: {
    handler: targetPlayerHandler,
  },
  [PACKET_ID.C_ActionBoss]: {
    handler: bossSpawnHandler,
  },
  //game
  [PACKET_ID.C_EnterPortal]: {
    handler: enterPotalHandler,
  },
  [PACKET_ID.C_Inventory]: {
    handler: inventoryHandler,
  },
  [PACKET_ID.C_UseSkill]: {
    handler: useSkillHandler,
  },
  // item
  [PACKET_ID.C_UseItem]: {
    handler: useItemHandler,
  },
  [PACKET_ID.C_PurchaseItem]: {
    handler: purchaseItemHandler,
  },
  [PACKET_ID.C_SellItem]: {
    handler: sellItemHandler,
  },
  [PACKET_ID.C_GetItem]: {
    handler: getItemHandler,
  },
  [PACKET_ID.C_DropItem]: {
    handler: dropItemHandler,
  },
  [PACKET_ID.C_EquipEquipment]: {
    handler: equipEquipmentHandler,
  },
  [PACKET_ID.C_UnequipWeapon]: {
    handler: unequipWeaponHandler,
  },

  // monster
  [PACKET_ID.C_MonsterDamage]: {
    handler: monsterDamageHandler,
  },
  [PACKET_ID.C_MonsterMove]: {
    handler: monsterMoveHandler,
  },
  [PACKET_ID.C_MonsterKill]: {
    handler: monsterKillHandler,
  },
  [PACKET_ID.C_MonsterSpawn]: {
    handler: monsterSpawnHandler,
  },

  // party
  [PACKET_ID.C_PartyJoin]: {
    handler: partyHandler,
  },
  [PACKET_ID.C_PartyLeave]: {
    handler: partyHandler,
  },

  // town
  [PACKET_ID.C_Enter]: {
    handler: enterHandler,
  },
  [PACKET_ID.C_Move]: {
    handler: movePlayerHandler,
  },
  [PACKET_ID.C_Animation]: {
    handler: animationHandler,
  },
  [PACKET_ID.C_Chat]: {
    handler: chatHandler,
  },
  // 다른 핸들러들 추가
};

export const getHandlerByPacketId = (packetId) => {
  if (!handlers[packetId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${packetId}`,
    );
  }

  return handlers[packetId].handler;
};

export const getProtoTypeNameByPacketType = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${packetType}`,
    );
  }

  return handlers[packetType].protoType;
};
