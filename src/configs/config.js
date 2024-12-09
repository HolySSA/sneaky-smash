import gameConfigs from './constants/game.js';
import headerConfigs from './constants/header.js';
import env from './constants/env.js';

const config = {
  ...gameConfigs,
  ...env,
  ...headerConfigs,
};

export default config;
