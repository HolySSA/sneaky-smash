import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import { findUserByAccount } from '../../db/user/user.db.js';
import { getCharacterByUserId } from '../../db/character/character.db.js';
import { addRedisUser, getRedisUserById } from '../../sessions/redis/redis.user.js';
import { addUserSession } from '../../sessions/user.session.js';
import User from '../../classes/model/user.class.js';
import enterLogic from '../../utils/etc/enter.logic.js';

const writeLoginResponse = (socket, success, message, token) => {
  const loginPayload = { success, message, token };

  const response = createResponse(PACKET_ID.S_Login, loginPayload);
  socket.write(response);
};

// 로그인 핸들러
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

    // 로그인 검증에 통과되었으므로 해당 socket에 id 부여 - redis에 저장된 유저 정보 조회 시 사용
    socket.id = existUser.id.toString();

    // db 캐릭터 테이블에서 해당 유저 캐릭터 찾고, 있으면 바로 S_Enter, S_Spawn
    let character = await getCharacterByUserId(existUser.id);

    if (character) {
      // 일단 user 테이블 id로
      const user = new User(existUser.id, character.myClass, character.nickname);

      // redis, session에 저장
      await addRedisUser(user);
      addUserSession(socket, user);

      return await enterLogic(socket, user);
    }

    // JWT 추가 로직 - 임시(리프레시 토큰 db에 저장하고 엑세스 토큰 발급해주는 형식으로)
    const TMP_SECRET_KEY = 'tmp_secret_key';

    const token = jwt.sign(existUser, TMP_SECRET_KEY, { expiresIn: '24h' });
    const bearerToken = `Bearer ${token}`;

    writeLoginResponse(socket, true, '로그인에 성공했습니다.', bearerToken);
  } catch (e) {
    handleError(socket, e);
  }
};

export default logInHandler;
