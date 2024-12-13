import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession, getDungeonUsersUUID } from '../../sessions/dungeon.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import logger from '../../utils/logger.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';

// Notification
const getSkillHandler = async ({ socket, payload }) => {
  const { skillId, itemInstanceId } = payload;
  const playerId = socket.id;
  try {
    const redisUser = await findCharacterByUserId(playerId);

    const dungeonUsersUUID = getDungeonUsersUUID(redisUser.sessionId);

    const skillInfo = getGameAssets().skillInfo.data.find((id) => id.skillId === skillId);
    if (!skillInfo) {
      logger.error(`스킬 정보를 찾을 수 없습니다. skillId: ${skillId}`);
      return;
    }

    const skillPayload = {
      skillInfo,
      playerId,
      itemInstanceId,
    };

    createNotificationPacket(PACKET_ID.S_GetSkill, skillPayload, dungeonUsersUUID);

    logger.info(`getSkillHandler 성공: playerId=${playerId}, skillId=${skillId}`);
  } catch (error) {
    handleError(socket, error);
  }
};

export default getSkillHandler;

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
