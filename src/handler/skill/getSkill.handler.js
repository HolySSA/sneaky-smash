import createResponse from '../../utils/packet/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

// message SkillInfo {
// 	int32	skillId	= 1;	// 스킬 ID
// 	float	damageRate 	= 2;	// 스킬 계수
// 	float	coolTime = 3;	// 스킬 쿨타임
// }

// message C_GetSkill {
//   int32 skillId = 1;     // 장착된 스킬 ID
//   int32 itemInstanceId = 2; 	// 고유 아이템 ID
// }

// message S_GetSkill {
//   SkillInfo skillInfo = 1; // 스킬 슬롯 정보
//   int32 playerId = 2;
//   int32 itemInstanceId = 3; 	// 고유 아이템 ID
// }

// Notification
const getSkillHandler = async ({ socket, payload }) => {
  const { skillId, itemInstanceId } = payload;
  const playerId = socket.id;
  try {
    const redisUser = await getRedisUserById(socket.id);
    if (!redisUser) {
      throw new Error(`getSkillHandler error. Cannot find redisUser by socket.id : ${socket.id}`);
    }

    const skillData = getGameAssets().skillInfo.data;
    const skillInfo = skillData.find((id) => id.skillId === skillId);

    const skillPayload = {
      skillInfo,
      playerId,
      itemInstanceId,
    };

    const response = createResponse(PACKET_ID.S_GetSkill, skillPayload);

    createNotificationPacket(PACKET_ID.S_GetSkill);
  } catch (error) {
    handleError(socket, error);
  }
};

export default getSkillHandler;
