import jwt from 'jsonwebtoken';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID, reverseMapping } from '../../constants/packetId.js';

// 로그인 핸들러
const logInHandler = async (socket, payload) => {
  try {
    const { account, password } = payload;

    // db에서 해당 아이디 찾기 -없으면 에러 발생

    // 세션(redis)에서 해당 아이디가 이미 접속해 있는 지 확인 - 접속해있으면 에러 발생

    // JWT 추가 로직 - 임시(리프레시 토큰 db에 저장하고 엑세스 토큰 발급해주는 형식으로)
    const TMP_SECRET_KEY = 'tmp_secret_key';

    const token = jwt.sign(user, TEMP_SECRET_KEY, { expiresIn: '24h' });
    const bearerToken = `Bearer ${token}`;

    /*=================
    bool success = 1;     // 성공 여부
    string message = 2;   // 메시지
    string token = 3;     // 토큰
    =================*/
    const logInPayload = {
      success: true,
      message: '로그인에 성공했습니다.',
      token: bearerToken,
    };

    // 세션(redis) 추가

    /*============
    C_Register: 19,
    S_Register: 20,
    C_LogIn: 21,
    S_LogIn: 22,
    ============*/

    // 숫자인데?
    const response = createResponse(PACKET_ID.S_LogIn, logInPayload);

    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default logInHandler;
