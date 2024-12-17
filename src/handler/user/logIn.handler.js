import jwt from 'jsonwebtoken';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import { addUserSession } from '../../sessions/user.session.js';
import enterLogic from '../../utils/etc/enter.logic.js';
import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';
import createResponse from '../../utils/packet/createResponse.js';
import { enqueueSend } from '../../utils/socket/messageQueue.js';

const { PACKET_ID, JWT_SECRET, JWT_ALGORITHM, JWT_ISSUER, JWT_AUDIENCE } = configs;

function verifyTokenAsync(token) {
  return new Promise((resolve, _) => {
    jwt.verify(
      token,
      JWT_SECRET,
      {
        algorithms: [JWT_ALGORITHM],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
      (err, decoded) => {
        if (err) resolve(null);
        else resolve(decoded);
      },
    );
  });
}

const logInHandler = async ({ socket, payload }) => {
  const { token } = payload;

  let success = true;
  let message = undefined;
  try {
    const verified = verifyTokenAsync(token);

    if (!verified) {
      success = false;
      message = '만료된 토큰 입니다.';
    } else {
      socket.id = Number(verified.id);
      socket.account = verified.account;
      addUserSession(socket);
      const loginBuffer = createResponse(PACKET_ID.S_Authorize, { success, message });
      enqueueSend(socket.UUID, loginBuffer);

      if (success) {
        const character = await findCharacterByUserId(socket.id);
        if (character) {
          await enterLogic(socket, character);
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

export default logInHandler;
