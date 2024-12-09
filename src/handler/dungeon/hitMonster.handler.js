import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import createResponse from '../../utils/response/createResponse.js';
import handleError from '../../utils/error/errorHandler.js';
import monsterKillNotification from '../monster/monsterKill.notification.js';

// message C_HitMonster{
//     int32 monsterId = 1;  // 플레이어 ID
//     int32 damage = 2;    // 데미지
//   }
//   // 몬스터 공격 알림
//   message S_HitMonster{
//     int32 monsterId = 1;  // 플레이어 ID
//     int32 damage = 2;    // 데미지
//   }

const hitMonsterHandler = async (socket, payload) => {
  try {
    const { monsterId, damage } = payload;

    const response = createResponse(PACKET_ID.S_HitMonster, { monsterId, damage });

    const redisUser = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    const monster = dungeon.monsterLogic.getMonsterById(monsterId);

    const targetYou = dungeon.getDungeonUser(socket.id);

    const currentHp = monster.hit(damage, targetYou);

    if (currentHp <= 0) {
      monsterKillNotification(socket, {
        monsterId: monster.id,
        transform: monster.transform,
      });
    }

    // 몬스터 체력 업데이트 노티피케이션
    const updateHpResponse = createResponse(PACKET_ID.S_UpdateMonsterHp, {
      monsterId,
      hp: currentHp,
    });

    allUsers.forEach((value) => {
      value.socket.write(response);
      value.socket.write(updateHpResponse);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default hitMonsterHandler;
