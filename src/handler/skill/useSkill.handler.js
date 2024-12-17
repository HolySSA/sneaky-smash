import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getDungeonSession, getDungeonUsersUUID } from '../../sessions/dungeon.session.js';
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

    const dungeon = getDungeonSession(user.dungeonId);

    const dungeonUser = dungeon.users.get(playerId);

    if (!dungeonUser) {
      logger.error(`useSkillHandler. could not found user : ${playerId}`);
    }

    const equippedSkill = dungeonUser.skillList[skillId];
    if (!equippedSkill) {
      logger.error(
        `useSkillHandler. could not found skill : ${playerId}/${skillId} => ${Object.keys(dungeonUser.skillList)}`,
      );
      return;
    }

    const now = Date.now();
    const timeDiff = now - equippedSkill.lastUseTime;
    if (timeDiff <= equippedSkill.coolTime) {
      logger.error(
        `useSkillHandler. this skill is cooldown : ${playerId}/${skillId} => ${timeDiff}`,
      );
      return;
    }
    equippedSkill.coolTime = now;
    // 내부에서 에러 처리
    const dungeonUsersUUID = getDungeonUsersUUID(user.dungeonId);

    // 스킬 인포 정보 가져오기
    const skillAssets = getGameAssets().skillInfo; // 맵핑된 스킬 데이터 가져오기
    const skillData = skillAssets[skillId]; // ID로 직접 접근

    if (!skillData) {
      logger.error(`Skill 정보를 찾을 수 없습니다. skillId: ${skillId}`);
      return;
    }

    const skillPayload = {
      playerId,
      skillInfo: { ...skillData, skillId },
      dir,
      transform,
    };

    createNotificationPacket(PACKET_ID.S_UseSkill, skillPayload, dungeonUsersUUID);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useSkillHandler;
