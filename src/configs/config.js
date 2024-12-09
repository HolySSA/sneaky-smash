import gameConfigs from './constants/game.js';
import headerConfigs from './constants/header.js';
import env from './constants/env.js';
import CONSTANTS from './constants/constants.js';
import { PACKET_ID } from './constants/packetId.js';

const configs = {
  ...gameConfigs,
  ...headerConfigs,
  ...CONSTANTS,
  ...env,
  PACKET_ID,
};

export default configs;
