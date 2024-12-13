import { getDungeonSession } from '../../sessions/dungeon.session.js';
import handleError from '../../utils/error/errorHandler.js';
import deathPlayerNotification from '../game/deathPlayer.notification.js';
import { getUserById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';

// message C_HitPlayer {
//   int32 playerId = 1;  // 피격자 ID
//   int32 damage = 2;    // 데미지
// }

// // 플레이어 공격 알림
// message S_HitPlayer {
//   int32 playerId = 1;  // 피격자 ID
//   int32 damage = 2;    // 데미지
// }

const hitPlayerHandler = async ({ socket, payload }) => {
  const { playerId, damage } = payload;
  const attackerId = socket.id;
  try {
    // 여기의 소켓은 공격자, playerId는 피격자.
    // 맞은 사람이 클라이언트에서 히트 처리 패킷 보냄
    const user = getUserById(playerId);
    if (!user) {
      logger.error(`hitPlayerHandler: User not found by 피격자 ${playerId}.`);
      return;
    }

    const dungeonId = user.dungeonId;
    const dungeon = getDungeonSession(dungeonId);

    // 플레이어가 플레이어를 잡으면 피회복을 하는 로직
    const currentHp = dungeon.damagedUser(playerId, damage);

    if (currentHp <= 0) {
      dungeon.getAmountHpByKillUser(attackerId);

      // 여기서부터 시작
      // deathPlayerNotification(socket, playerId);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default hitPlayerHandler;
