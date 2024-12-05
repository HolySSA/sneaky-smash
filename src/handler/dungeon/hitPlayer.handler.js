import { PACKET_ID } from '../../constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import createResponse from '../../utils/response/createResponse.js';
import handleError from '../../utils/error/errorHandler.js';

// message C_HitPlayer{
//     int32 playerId = 1;  // 공격자 ID
//     int32 damage = 2;    // 데미지
//   }
//   // 플레이어 공격 알림
//   message S_HitPlayer{

const hitPlayerHandler = async (socket, payload) => {
  try {
    const { playerId, damage } = payload;

    // 맞은 사람이 클라이언트에서 히트 처리 패킷 보냄
    const redisUser = await getRedisUserById(playerId);

    const dungeon = getDungeonSession(redisUser.sessionId);

    const currentHp = dungeon.damagedUser(playerId, damage);

    // updatePlayerHp 노티피케이션
    const updatePlayerHpResponse = createResponse(PACKET_ID.S_UpdatePlayerHp, {
      playerId,
      hp: currentHp,
    });

    const allUsers = dungeon.getAllUsers();

    const response = createResponse(PACKET_ID.S_HitPlayer, { playerId, damage });

    allUsers.forEach((value) => {
      value.userInfo.socket.write(response);
      value.userInfo.socket.write(updatePlayerHpResponse);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default hitPlayerHandler;
