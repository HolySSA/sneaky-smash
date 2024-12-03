import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import { findUserByAccount } from '../../db/model/user.db.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import { addRedisUser, getRedisUserById } from '../../sessions/redis/redis.user.js';
import { addUserSession } from '../../sessions/user.session.js';
import enterLogic from '../../utils/etc/enter.logic.js';

// message C_Login {
//     string account = 1;  // 아이디
//     string password = 2;  // 비밀번호
// }

// message S_Login {
//     bool success = 1;     // 성공 여부
//     string message = 2;   // 메시지
//     string token = 3;     // 토큰
// }

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

    const connectedUser = await getRedisUserById(existUser.id);
    if (connectedUser) {
      writeLoginResponse(socket, false, '이미 접속 중인 유저입니다.', null);
      return;
    }

    // 로그인 검증 통과 - socket.id 할당
    socket.id = existUser.id.toString();

    const character = await findCharacterByUserId(existUser.id);

    if (character) {
      addUserSession(socket);
      await addRedisUser(existUser.id, character.nickname, character.myClass);

      const user = await getRedisUserById(existUser.id);
      await enterLogic(socket, user);

      return;
    }

    // JWT 추가 로직 - 임시(리프레시 토큰 db에 저장하고 엑세스 토큰 발급해주는 형식으로)
    const TMP_SECRET_KEY = 'tmp_secret_key';

    const token = jwt.sign({ id: existUser.id }, TMP_SECRET_KEY, { expiresIn: '24h' });
    const bearerToken = `Bearer ${token}`;

    writeLoginResponse(socket, true, '로그인에 성공했습니다.', bearerToken);
  } catch (e) {
    handleError(socket, e);
  }
};

export default logInHandler;
