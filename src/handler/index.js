import { PACKET_ID } from '../configs/constants/packetId.js';
import CustomError from '../utils/error/customError.js';
import ErrorCodes from '../utils/error/errorCodes.js';
// town
import enterHandler from './town/enter.handler.js';
import movePlayerHandler from './town/move.player.handler.js';
import animationHandler from './town/animation.handler.js';
import chatHandler from './town/chat.handler.js';
// user
import registerHandler from './user/register.handler.js';
import logInHandler from './user/logIn.handler.js';
// dungeon
import hitMonsterHandler from './dungeon/hitMonster.handler.js';
import hitPlayerHandler from './dungeon/hitPlayer.handler.js';
import leaveDungeonHandler from './dungeon/leaveDungeon.handler.js';
// item
import useItemHandler from './item/useItem.handler.js';
// skill
import getSkillHandler from './skill/getSkill.handler.js';
import shootProjectileHandler from './skill/shootProjectile.handler.js';
import useSkillHandler from './skill/useSkill.handler.js';
// game
import attackedNexusHandler from './game/attackedNexus.handler.js';
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
  // dungeon
  [PACKET_ID.C_LeaveDungeon]: {
    handler: leaveDungeonHandler,
  },
  [PACKET_ID.C_HitMonster]: {
    handler: hitMonsterHandler,
  },
  [PACKET_ID.C_HitPlayer]: {
    handler: hitPlayerHandler,
  },

  // item
  [PACKET_ID.C_UseItem]: {
    handler: useItemHandler,
  },
  // skill
  [PACKET_ID.C_GetSkill]: {
    handler: getSkillHandler,
  },
  [PACKET_ID.C_ShootProjectile]: {
    handler: shootProjectileHandler,
  },
  [PACKET_ID.C_UseSkill]: {
    handler: useSkillHandler,
  },
  // game
  [PACKET_ID.C_AttackedNexus]: {
    handler: attackedNexusHandler,
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
