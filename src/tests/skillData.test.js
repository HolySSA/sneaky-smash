import { getGameAssets, loadGameAssets } from '../init/loadAsset.js';

(async () => {
  try {
    await loadGameAssets();

    await getGameAssets();

    const skillId = 101;

    const skillData = getGameAssets().skillInfo.data.find((skill) => skill.skillId === skillId);

    if (skillData) {
      console.log(`Skill Data =>`, skillData);
    } else {
      console.log(`Skill with ID ${skillId} not found.`);
    }
  } catch (error) {
    console.error(`Error during test`, error);
  }
})();
