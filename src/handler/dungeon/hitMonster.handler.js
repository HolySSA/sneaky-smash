import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import handleError from '../../utils/error/errorHandler.js';
import monsterKillNotification from '../monster/monsterKill.notification.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import logger from '../../utils/logger.js';
import { getUserById } from '../../sessions/user.session.js';

const hitMonsterHandler = ({ socket, payload }) => {
  const { monsterId, damage } = payload;
  const playerId = socket.id;
  try {
    const user = getUserById(playerId);
    if (!user) {
      logger.error('HitMonsterHandler: User not found.');
      return;
    }

    const dungeonId = user.dungeonId;
    const dungeon = getDungeonSession(dungeonId);

    const monster = dungeon.monsterLogic.getMonsterById(monsterId);
    if (!monster) {
      logger.error(`HitMonsterHandler: Monster not found by monsterId:${monsterId}`);
      return;
    }

    const targetUser = dungeon.getDungeonUser(playerId);
    const currentHp = monster.hit(damage, targetUser);

    const dungeonAllUsersUUID = dungeon.getDungeonUsersUUID();

    // 공격당한 몬스터 hp noti
    createNotificationPacket(
      PACKET_ID.S_UpdateMonsterHp,
      { monsterId, hp: Math.ceil(currentHp) },
      dungeonAllUsersUUID,
    );

    // 공격당한 monster noti
    createNotificationPacket(PACKET_ID.S_HitMonster, { monsterId, damage }, dungeonAllUsersUUID);

    // 몬스터의 죽음을 알리지 마라 이놈들아!
    if (currentHp <= 0) {
      dungeon.monsterLogic.destroyMonsterById(monsterId);
      monsterKillNotification(socket, monster, dungeon, dungeonAllUsersUUID);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default hitMonsterHandler;
