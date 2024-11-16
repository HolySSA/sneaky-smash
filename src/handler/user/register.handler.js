import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';
import joiUtils from '../../utils/joi/joiUtils.js';
import config from '../../config/config.js';

const packetType = config.packet.type;

const registerHandler = async (socket, payload) => {
    try {
        const { account, password } = await joiUtils.validateRegister(payload);

        // db에서 중복 아이디 찾기

        // db에서 아이디 생성하기

        const registerResponse = {
            success: true,
            message: '회원가입에 성공했습니다!',
        };

        const response = createResponse(registerResponse, packetType.sRegister);

        socket.write(response);
    } catch (e){
        handleError(socket, e);
    }
}

export default registerHandler;