import { getDungeonSession } from '../../sessions/dungeon.session.js';
import handleError from '../../utils/error/errorHandler.js';
import deathPlayerNotification from '../game/deathPlayer.notification.js';
import { getUserById } from '../../sessions/user.session.js';
import logger from '../../utils/logger.js';

const hitPlayerHandler = ({ socket, payload }) => {
  const { playerId, damage } = payload;
  const attackerId = socket.id;
  try {
    // 여기의 소켓은 공격자, playerId는 피격자.
    // 맞은 사람이 클라이언트에서 히트 처리 패킷 보냄

    const user = getUserById(playerId);
    if (!user) {
      //  logger.error(`hitPlayerHandler: User not found by 피격자 ${playerId}.`);
      return;
    }

    const dungeonId = user.dungeonId;
    if (!dungeonId) {
      //던전이 아니면 계산필요 x
      return;
    }
    const dungeon = getDungeonSession(dungeonId);

    // 플레이어가 플레이어를 잡으면 피회복을 하는 로직
    const resultDamage = dungeon.damagedUser(playerId, damage);
    const currentHp = dungeon.updatePlayerHp(playerId, -resultDamage);

    if (currentHp <= 0) {
      if (attackerId != playerId) {
        dungeon.increaseUserKillCount(attackerId);
        dungeon.getAmountHpByKillUser(attackerId);
      }
      deathPlayerNotification(playerId, dungeon);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default hitPlayerHandler;
