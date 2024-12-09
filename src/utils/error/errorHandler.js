import createResponse from '../packet/createResponse.js';
import logger from '../logger.js';

const handleError = (socket, error) => {
  let responseCode;
  let message;

  if (error.code) {
    responseCode = error.code;
    message = error.message;

    logger.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  } else {
    responseCode = 10000; // 일반 에러 코드
    message = error.message;

    logger.error(`일반 에러: ${error.message}`);
  }

  // 스택 트레이스 출력
  if (error.stack) {
    logger.error(`스택 트레이스:\n${error.stack}`);
  } else {
    logger.error('스택 트레이스 정보가 없습니다.');
  }

  const errorResponse = createResponse(-1, { message });
  socket.write(errorResponse);
};

export default handleError;
