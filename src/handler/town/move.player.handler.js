import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import {
  getAllUserUUID,
  getUserById,
  updateUserTransformById,
} from '../../sessions/user.session.js';
import broadcastBySession from '../../utils/notification/broadcastBySession.js';
import Result from '../result.js';
/**
 * 무브 핸들러
 * @param {object} socket - 클라이언트 소켓
 * @param {object} payload - 클라이언트에서 전송한 데이터
 */
const movePlayerHandler = async ({ socket, payload }) => {
  const { posX, posY, posZ, rot } = payload.transform;
  const transform = updateUserTransformById(socket.id, posX, posY, posZ, rot);

  const movePayload = {
    playerId: socket.id,
    transform: transform,
  };

  broadcastBySession(socket, PACKET_ID.S_Move, movePayload, true);
};

export default movePlayerHandler;
