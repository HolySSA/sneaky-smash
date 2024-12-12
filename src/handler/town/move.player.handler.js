import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getAllUserUUID, updateUserTransformById } from '../../sessions/user.session.js';
import Result from '../result.js';
/**
 * 무브 핸들러
 * @param {object} socket - 클라이언트 소켓
 * @param {object} payload - 클라이언트에서 전송한 데이터
 */
const movePlayerHandler = async ({ socket, payload }) => {
  const allUsers = getAllUserUUID().filter((uuid) => uuid !== socket.UUID);
  const { posX, posY, posZ, rot } = payload.transform;
  const transform = updateUserTransformById(socket.id, posX, posY, posZ, rot);

  const movePayload = {
    playerId: socket.id,
    transform: transform,
  };

  if (allUsers.length > 0) {
    return new Result(movePayload, PACKET_ID.S_Move, allUsers);
  }
};

export default movePlayerHandler;
