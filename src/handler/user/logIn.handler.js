import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import { findUserByAccount } from '../../db/user/user.db.js';
import { addUser, getUserById } from '../../utils/redis/user.session.js';
import { getCharacterByUserId } from '../../db/character/character.db.js';

// 로그인 핸들러
const logInHandler = async (socket, payload) => {
  try {
    const { account, password } = payload;

    // db에서 해당 아이디 찾기
    const user = await findUserByAccount(account);
    if (!user) {
      const logInResponse = {
        success: false,
        message: '존재하지 않는 아이디입니다.',
        token: null,
      };

      const response = createResponse(PACKET_ID.S_LogIn, logInResponse);
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

      const response = createResponse(PACKET_ID.S_LogIn, logInResponse);
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

      const response = createResponse(PACKET_ID.S_LogIn, logInResponse);
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

    // 로그인 검증에 통과되었으므로 해당 socket에 id 부여
    socket.id = user.id;

    const response = createResponse(PACKET_ID.S_LogIn, logInPayload);
    socket.write(response);

    // db 캐릭터 테이블에서 해당 유저 캐릭터 찾고, 있으면 바로 S_Enter, S_Spawn
    let character = getCharacterByUserId(user.id);
    if (character) {
      // 일단 user 테이블 id로 저장
      const userSession = await addUser(socket, user.id, character.class, character.nickname);
      await enterLogic(userSession);
    }
  } catch (e) {
    handleError(socket, e);
  }
};

const enterLogic = async (userSession) => {
  const player = {
    playerId: userSession.id,
    nickname: userSession.nickname,
    class: userSession.myClass,
    // inventory: userSession.inventory,
  };

  const enterPayload = {
    player,
  };

  const response = createResponse(PACKET_ID.S_Enter, enterPayload);
  socket.write(response);

  /*
  const allUsers = await getAllUsers();

  const spawnPayload = {
    players: allUsers.map((user) => ({
      playerId: user.id,
      nickname: user.nickname,
      class: user.myClass,
    })),
  };

  const notification = createNotificationPacket(PACKET_ID.S_Spawn, spawnPayload);

  allUsers.forEach((user) => {
    user.socket.write(notification);
  });
  */
};

export default logInHandler;
