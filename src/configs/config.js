import gameConfigs from './constants/game.js';
import headerConfigs from './constants/header.js';
import env from './constants/env.js';
import userDatabases from './constants/userDatabase.js';
import packet from './constants/packet.js';

const configs = {
  ...gameConfigs,
  ...env,
  ...headerConfigs,
  ...userDatabases,
  ...packet,
  HOST,
  PORT,
  CLIENT_VERSION,
};

export default configs;
