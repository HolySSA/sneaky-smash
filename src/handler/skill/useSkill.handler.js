import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getDungeonUsersUUID } from '../../sessions/dungeon.session.js';
import { getGameAssets } from '../../init/loadAsset.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import logger from '../../utils/logger.js';

// notification
const useSkillHandler = async ({ socket, payload }) => {
  const { skillId, dir, transform } = payload;
  const playerId = socket.id;
  try {
    const redisUser = await findCharacterByUserId(playerId);

    // 내부에서 에러 처리
    const dungeonUsersUUID = getDungeonUsersUUID(redisUser.sessionId);

    // 스킬 인포 정보 가져오기
    const skillInfo = getGameAssets().skillInfo.data.find((id) => id.skillId === skillId);
    if (!skillInfo) {
      logger.error(`Skill with ID ${skillId} not found in skillInfo.data.`);
      return;
    }

    const skillPayload = {
      playerId,
      skillInfo,
      dir,
      transform,
    };

    createNotificationPacket(PACKET_ID.S_UseSkill, skillPayload, dungeonUsersUUID);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useSkillHandler;

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
