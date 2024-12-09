import gameConfigs from './constants/game.js';
import headerConfigs from './constants/header.js';
import env from './constants/env.js';

const config = {
  ...gameConfigs,
  ...env,
  ...headerConfigs,

  server: {
    host: HOST,
    port: PORT,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    length: PACKET_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
  },
  databases: {
    USER_DB: {
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
    },
    // 필요한 만큼 추가
  },
  game: {
    itemDropRate: ITEM_DROP_RATE,
    skillDropRate: SKILL_DROP_RATE,
  },
};

export default config;
