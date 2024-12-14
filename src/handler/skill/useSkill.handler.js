import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getDungeonUsersUUID } from '../../sessions/dungeon.session.js';
import { getGameAssets } from '../../init/loadAsset.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import logger from '../../utils/logger.js';
import { getUserById } from '../../sessions/user.session.js';

// notification
const useSkillHandler = async ({ socket, payload }) => {
  const { skillId, dir, transform } = payload;
  const playerId = socket.id;
  try {
    const user = getUserById(playerId);
    if (!user) {
      logger.error(`useSkillHandler. Could not found user : ${playerId}`);
      return;
    }

    if (!user.dungeonId) {
      logger.error(`useSkillHandler. this player not in the dungeon : ${playerId}`);
      return;
    }

    // 내부에서 에러 처리
    const dungeonUsersUUID = getDungeonUsersUUID(user.dungeonId);

    // 스킬 인포 정보 가져오기
    const skillAssets = getGameAssets().skillInfo; // 맵핑된 스킬 데이터 가져오기
    const skillData = skillAssets[skillId];  // ID로 직접 접근

    if (!skillData) {
      logger.error(`Skill 정보를 찾을 수 없습니다. skillId: ${skillId}`);
      return;
    }

    const skillPayload = {
      playerId,
      skillInfo : {...skillData, skillId },
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
