import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import { getGameAssets } from '../../init/loadAsset.js';

// message SkillInfo {
// 	int32	skillId	= 1	// 스킬 ID
//  int32   damageRate = 2 //
// 	float	coolTime= 3	// 스킬 쿨타임
// }
// message C_UseSkill {
//   int32 skillId = 1; // 사용할 스킬 ID
//   ProjectileDirection dir = 2;
//   TransformInfo transform = 3;
//   }

//   message S_UseSkill {
//   int32 playerId = 1; // 플레이어 고유 ID
//   SkillInfo skillInfo = 2; // 사용된 스킬 정보
//   ProjectileDirection dir = 3;
//   TransformInfo transform = 4;
//   }

const useSkillHandler = async (socket, payload) => {
  try {
    const { skillId, dir, transform } = payload;

    // 스킬 인포 정보 가져오기
    const skillData = getGameAssets().skillInfo.data.find((id) => id.skillId === skillId);

    const skillPayload = {
      playerId: socket.id,
      skillInfo: {
        skillId,
        damageRate: skillData.damageRate,
        coolTime: skillData.coolTime,
      },
      dir,
      transform,
    };

    const response = createResponse(PACKET_ID.S_UseSkill, skillPayload);
    const redisUser = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);
    const allUsers = dungeon.getAllUsers();

    allUsers.forEach((value) => {
      value.socket.write(response);
    });
  } catch (e) {
    handleError(socket, e);
  }
};
export default useSkillHandler;
