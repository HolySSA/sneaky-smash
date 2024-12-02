
// message C_HitMonster{
//     int32 monsterId = 1;  // 플레이어 ID
//     int32 damage = 2;    // 데미지
//   }
//   // 몬스터 공격 알림
//   message S_HitMonster{
//     int32 monsterId = 1;  // 플레이어 ID
//     int32 damage = 2;    // 데미지
//   }

import { PACKET_ID } from "../../constants/packetId.js";
import { getDungeonSession } from "../../sessions/dungeon.session.js";
import { getRedisUserById } from "../../sessions/redis/redis.user.js";
import createResponse from "../../utils/response/createResponse.js";
;

const hitMonsterHandler = async (socket, payload) => {
    try {
        const { monsterId, damage } = payload;

        const response = createResponse(PACKET_ID.S_HitMonster, { monsterId, damage });
        
        const redisUser = await getRedisUserById(socket.id);
        
        const dungeon = getDungeonSession(redisUser.sessionId);
        
        const allUsers = dungeon.getAllUsers();

        const monster =  dungeon.monsterLogic.getMonsterById(monsterId);

        const currentHp = monster.hit(damage);

        updateMonsterHpNotification(socket, { monsterId, currentHp });        
        
        allUsers.forEach((value) =>{
            value.socket.write(response);
        })
        
    } catch (err) {
        handleError(err);
    }
};

export default hitMonsterHandler;