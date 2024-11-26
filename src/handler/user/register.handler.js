import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import joiUtils from '../../utils/joi/joiUtils.js';
import config from '../../config/config.js';
import { PACKET_ID } from '../../constants/packetId.js';
import { findUserByAccount, createUser } from '../../db/model/user.db.js';
import bcrypt from 'bcrypt';

//const packetType = config.packet.type;

const registerHandler = async (socket, payload) => {
  try {
    console.log('payload: ', payload);
    const { account, password } = await joiUtils.validateRegister(payload);

    // db에서 중복 아이디 찾기
    const isAccountExist = await findUserByAccount(account);
    if (isAccountExist) {
      const registerResponse = {
        success: false,
        message: '이미 존재하는 아이디입니다.',
      };

      const response = createResponse(PACKET_ID.S_Register, registerResponse);
      socket.write(response);
      return;
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    // db에서 아이디 생성하기
    const newUser = await createUser(account, hashedPassword);

    const registerResponse = {
      success: true,
      message: '회원가입에 성공했습니다!',
    };

    // PACKET_ID.S_Register: 20
    const response = createResponse(PACKET_ID.S_Register, registerResponse);

    console.log('회원가입 성공!');
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default registerHandler;
