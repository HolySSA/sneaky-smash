import { PACKET_ID } from '../constants/packetId.js';
import CustomError from '../utils/error/customError.js';
import ErrorCodes from '../utils/error/errorCodes.js';
// town
import enterHandler from './town/enter.handler.js';
import { movePlayerHandler } from './town/move.player.handler.js';
import animationHandler from './town/animation.handler.js';
import chatHandler from './town/chat.handler.js';
// user
import registerHandler from './user/register.handler.js';
import logInHandler from './user/logIn.handler.js';
// battle
import leaveDungeonHandler from './battle/leaveDungeon.handler.js';
import monsterActionHandler from './battle/monsterAction.handler.js';
// item
import useItemHandler from './item/useItem.handler.js';
import equipEquipmentHandler from './item/equipEquipment.handler.js';
import unequipWeaponHandler from './item/unequipWeapon.handler.js';
// game
import inventoryHandler from './game/inventory.handler.js';
import useSkillHandler from './game/useSkill.handler.js';
// monster
import monsterAttackHandler from './monster/monsterAttack.handler.js';
import monsterKillHandler from './monster/monsterKill.handler.js';
import monsterMoveHandler from './monster/monsterMove.handler.js';
import monsterSpawnHandler from './monster/monsterSpawn.handler.js';
// boss
import actionBossHandler from './boss/ActionBoss.handler.js';
import bossSpawnHandler from './boss/bossSpawn.handler.js';
import targetPlayerHandler from './boss/targetPlayer.handler.js';
// party
import partyLeaveHandler from './party/party.leave.handler.js';
import partyHandler from './party/party.handler.js';
import dungeonStartHandler from './party/dungeon.start.handler.js';
import partyJoinHandler from './party/party.join.handler.js';

const handlers = {
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
  // user
  [PACKET_ID.C_Register]: {
    handler: registerHandler,
  },
  [PACKET_ID.C_Login]: {
    handler: logInHandler,
  },
  // battle
  [PACKET_ID.C_LeaveDungeon]: {
    handler: leaveDungeonHandler,
  },
  [PACKET_ID.C_MonsterAction]: {
    handler: monsterActionHandler,
  },
  // item
  [PACKET_ID.C_UseItem]: {
    handler: useItemHandler,
  },
  [PACKET_ID.C_EquipEquipment]: {
    handler: equipEquipmentHandler,
  },
  [PACKET_ID.C_UnequipWeapon]: {
    handler: unequipWeaponHandler,
  },
  //game
  [PACKET_ID.C_Inventory]: {
    handler: inventoryHandler,
  },
  [PACKET_ID.C_UseSkill]: {
    handler: useSkillHandler,
  },
  // monster
  [PACKET_ID.C_MonsterAttack]: {
    handler: monsterAttackHandler,
  },
  [PACKET_ID.C_MonsterMove]: {
    handler: monsterMoveHandler,
  },
  [PACKET_ID.C_MonsterKill]: {
    handler: monsterKillHandler,
  },
  [PACKET_ID.C_EnterStage]: {
    handler: monsterSpawnHandler,
  },
  // boss
  [PACKET_ID.C_BossSpawn]: {
    handler: bossSpawnHandler,
  },
  [PACKET_ID.C_TargetPlayer]: {
    handler: targetPlayerHandler,
  },
  [PACKET_ID.C_ActionBoss]: {
    handler: actionBossHandler,
  },
  // party
  [PACKET_ID.C_Party]: {
    handler: partyHandler,
  },
  [PACKET_ID.C_PartyJoin]: {
    handler: partyJoinHandler,
  },
  [PACKET_ID.C_MatchStart]: {
    handler: dungeonStartHandler,
  },
  [PACKET_ID.C_PartyLeave]: {
    handler: partyLeaveHandler,
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
