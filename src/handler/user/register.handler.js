import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import joiUtils from '../../utils/joi/joiUtils.js';
import config from '../../config/config.js';
import { PACKET_ID, reverseMapping } from '../../constants/packetId.js';

//const packetType = config.packet.type;

const registerHandler = async (socket, payload) => {
  try {
    console.log('payload: ', payload);
    const { account, password } = await joiUtils.validateRegister(payload);

    // db에서 중복 아이디 찾기

    // db에서 아이디 생성하기

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
