import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getAllUserUUID, updateUserTransformById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';
import Result from '../result.js';
/**
 * 무브 핸들러
 * @param {object} socket - 클라이언트 소켓
 * @param {object} payload - 클라이언트에서 전송한 데이터
 */
const movePlayerHandler = async ({ socket, payload }) => {
  const allUsers = getAllUserUUID();
  var movePayload;
  try {
    const { posX, posY, posZ, rot } = payload.transform;

    // 소켓에서 유저 정보 가져오기
    const user = await getRedisUserById(socket.id);
    const transform = updateUserTransformById(socket.id, posX, posY, posZ, rot);

    movePayload = {
      playerId: parseInt(user.id),
      transform: transform,
    };
  } catch (error) {
    logger.error('무브 핸들러 실행 중 오류 발생:', error.message);
  }
  return new Result(movePayload, PACKET_ID.S_Move, allUsers);
};

export default movePlayerHandler;
