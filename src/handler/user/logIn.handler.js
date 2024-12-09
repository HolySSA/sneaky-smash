import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import { findUserByAccount } from '../../db/model/user.db.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import { addRedisUser, getRedisUserById } from '../../sessions/redis/redis.user.js';
import { addUserSession } from '../../sessions/user.session.js';
import enterLogic from '../../utils/etc/enter.logic.js';
import configs from '../../configs/configs.js';
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_ALGORITHM, JWT_ISSUER, JWT_AUDIENCE } = configs;

// message C_Login {
//     string account = 1;  // 아이디
//     string password = 2;  // 비밀번호
// }

// message S_Login {
//     bool success = 1;     // 성공 여부
//     string message = 2;   // 메시지
//     string token = 3;     // 토큰
// }

function isTokenValid(token) {
  try {
    jwt.verify(token, JWT_SECRET);
    return true; // 토큰이 유효하고 만료되지 않음
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return false; // 토큰이 만료됨
    }
    return false; // 토큰이 유효하지 않음
  }
}

const writeLoginResponse = (socket, success, message, token) => {
  const loginPayload = { success, message, token };

  const response = createResponse(PACKET_ID.S_Login, loginPayload);
  socket.write(response);
};

const logInHandler = async (socket, payload) => {
  try {
    const { account, password } = payload;

    // db에서 해당 아이디 찾기
    const existUser = await findUserByAccount(account);
    if (!existUser) {
      writeLoginResponse(socket, false, '존재하지 않는 아이디입니다.', null);
      return;
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      writeLoginResponse(socket, false, '비밀번호가 일치하지 않습니다.', null);
      return;
    }

    // 로그인 검증 통과 - socket.id 할당
    socket.id = existUser.id.toString();

    const character = await findCharacterByUserId(existUser.id);
    if (character) {
      addUserSession(socket);
      await addRedisUser(existUser.id, character.nickname, character.myClass);
      await enterLogic(socket);
      return;
    }
    const token = jwt.sign({ id: existUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: JWT_ALGORITHM,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    const bearerToken = `Bearer ${token}`;
    writeLoginResponse(socket, true, '로그인에 성공했습니다.', bearerToken);
  } catch (e) {
    handleError(socket, e);
  }
};

export default logInHandler;
