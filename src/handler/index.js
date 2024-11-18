import { PACKET_ID } from '../constants/packetId.js';
import CustomError from '../utils/error/customError.js';
import ErrorCodes from '../utils/error/errorCodes.js';
import { movePlayerHandler } from './game/move.player.handler.js';
import logInHandler from './user/logIn.handler.js';
import registerHandler from './user/register.handler.js';

const handlers = {
  [PACKET_ID.C_Register]: {
    handler: registerHandler,
  },
  [PACKET_ID.C_LogIn]: {
    handler: logInHandler,
  },
  [PACKET_ID.C_Move]: {
    handler: movePlayerHandler,
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
