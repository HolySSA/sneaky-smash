import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import { findUserByAccount } from '../../db/user/user.db.js';
import { addUser, getUserById } from '../../utils/redis/user.session.js';

// 로그인 핸들러
const logInHandler = async (socket, payload) => {
  try {
    const { account, password, nickname, myClass } = payload;

    // db에서 해당 아이디 찾기
    const user = await findUserByAccount(account);
    if (!user) {
      const logInResponse = {
        success: false,
        message: '존재하지 않는 아이디입니다.',
        token: null,
      };

      const response = createResponse(PACKET_ID.S_Login, logInResponse);
      socket.write(response);
      return;
    }

    // console.log('user: ', user);
    // console.log('password: ', user.password);

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const logInResponse = {
        success: false,
        message: '비밀번호가 일치하지 않습니다.',
        token: null,
      };

      const response = createResponse(PACKET_ID.S_Login, logInResponse);
      socket.write(response);
      return;
    }

    const connectedUser = await getUserById(user.id);
    if (connectedUser) {
      const logInResponse = {
        success: false,
        message: '이미 접속 중인 유저입니다.',
        token: null,
      };

      const response = createResponse(PACKET_ID.S_Login, logInResponse);
      socket.write(response);
      return;
    }

    // JWT 추가 로직 - 임시(리프레시 토큰 db에 저장하고 엑세스 토큰 발급해주는 형식으로)
    const TMP_SECRET_KEY = 'tmp_secret_key';

    const token = jwt.sign(user, TMP_SECRET_KEY, { expiresIn: '24h' });
    const bearerToken = `Bearer ${token}`;

    const logInPayload = {
      success: true,
      message: '로그인에 성공했습니다.',
      token: bearerToken,
    };

    // db 클래스, 닉네임 불러오기. - 없으면 생성

    const response = createResponse(PACKET_ID.S_Login, logInPayload);

    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default logInHandler;
