import gameConfigs from './constants/game.js';
import headerConfigs from './constants/header.js';
import env from './constants/env.js';
import CONSTANTS from './constants/constants.js';

const configs = {
  ...gameConfigs,
  ...headerConfigs,
  ...CONSTANTS,
  ...env,
};

export default configs;
