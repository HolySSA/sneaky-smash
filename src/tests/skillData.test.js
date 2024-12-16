import { getGameAssets, loadGameAssets } from '../init/loadAsset.js';
import logger from '../utils/logger.js';

(async () => {
  try {
    await loadGameAssets();

    await getGameAssets();

    const skillId = 101;

    const skillAssets = getGameAssets().skillInfo; // 맵핑된 스킬 데이터 가져오기
    const skillData = skillAssets[skillId]; // ID로 직접 접근

    if (!skillData) {
      logger.error(`Skill 정보를 찾을 수 없습니다. skillId: ${skillId}`);
      return;
    }

    if (skillData) {
      console.log(`Skill Data =>`, skillData);
    } else {
      console.log(`Skill with ID ${skillId} not found.`);
    }
  } catch (error) {
    console.error(`Error during test`, error);
  }
})();
