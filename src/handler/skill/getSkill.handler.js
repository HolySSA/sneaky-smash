import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import logger from '../../utils/logger.js';
import { getUserById } from '../../sessions/user.session.js';
import { enqueueSend } from '../../utils/socket/messageQueue.js';
import createResponse from '../../utils/packet/createResponse.js';

// Notification
const getSkillHandler = ({ socket, payload }) => {
  const { skillId, itemInstanceId, slotIndex } = payload;

  const playerId = socket.id;
  try {
    const user = getUserById(playerId);
    if (!user) {
      logger.error(`getSkillHandler. Could not found user : ${playerId}`);
      return;
    }

    if (!user.dungeonId) {
      logger.error(`getSkillHandler. this player not in the dungeon : ${playerId}`);
      return;
    }

    const skillAssets = getGameAssets().skillInfo; // 맵핑된 스킬 정보 가져오기
    const skillData = skillAssets[skillId]; // ID로 직접 접근

    const dungeon = getDungeonSession(user.dungeonId);

    const dungeonUser = dungeon.users.get(playerId);

    if (!dungeonUser) {
      logger.error(`getSkillHandler. could not found dungeonUser`);
      return;
    }

    const droppedSkillInfo = dungeon.getDroppedObject(playerId, skillId, itemInstanceId);
    if (!droppedSkillInfo) {
      return;
    }

    //지정 슬롯외의 값이 오면 폐기하겠단 의미이므로 삭제
    if (slotIndex > 2 || slotIndex < 0) {
      logger.info(`getSkillHandler. no available skill slot : ${slotIndex}`);
      return;
    }

    if (!skillData) {
      logger.error(`스킬 정보를 찾을 수 없습니다. skillId: ${skillId}`);
      return;
    }

    dungeonUser.skillList[skillId] = { slot: slotIndex, ...skillData, lastUseTime: 0 };

    const skillPayload = {
      skillInfo: { ...skillData, skillId },
      playerId,
      itemInstanceId,
    };

    const buffer = createResponse(PACKET_ID.S_GetSkill, skillPayload);
    enqueueSend(socket.UUID, buffer);
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
