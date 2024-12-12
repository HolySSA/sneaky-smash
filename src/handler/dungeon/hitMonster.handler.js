import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import createResponse from '../../utils/packet/createResponse.js';
import handleError from '../../utils/error/errorHandler.js';
import monsterKillNotification from '../monster/monsterKill.notification.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

// message C_HitMonster{
//     int32 monsterId = 1;  // 플레이어 ID
//     int32 damage = 2;    // 데미지
//   }
//   // 몬스터 공격 알림
//   message S_HitMonster{
//     int32 monsterId = 1;  // 플레이어 ID
//     int32 damage = 2;    // 데미지
//   }

const hitMonsterHandler = async ({ socket, payload }) => {
  const { monsterId, damage } = payload;
  const playerId = socket.id;
  try {
    const redisUser = await findCharacterByUserId(playerId);
    if (!redisUser) {
      throw new Error('HitMonsterHandler: User not found.');
    }

    const dungeonId = redisUser.sessionId;
    const dungeon = getDungeonSession(dungeonId);

    const monster = dungeon.monsterLogic.getMonsterById(monsterId);
    if (!monster) {
      throw new Error(`HitMonsterHandler: Monster not found by monsterId:${monsterId}`);
    }

    const targetUser = dungeon.getDungeonUser(playerId);
    const currentHp = monster.hit(damage, targetUser);

    const dungeonAllUsersUUID = dungeon.getDungeonUsersUUID();

    // 공격당한 몬스터 hp noti
    createNotificationPacket(
      PACKET_ID.S_UpdateMonsterHp,
      { monsterId, hp: currentHp },
      dungeonAllUsersUUID,
    );

    // 공격당한 monster noti
    createNotificationPacket(PACKET_ID.S_HitMonster, { monsterId, damage }, dungeonAllUsersUUID);

    // 몬스터의 죽음을 알리지 마라 이놈들아!
    if (currentHp <= 0) {
      await monsterKillNotification(socket, {
        monsterId: monster.id,
        transform: monster.transform,
      });
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default hitMonsterHandler;
