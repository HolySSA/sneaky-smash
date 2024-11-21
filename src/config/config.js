import {
  CLIENT_VERSION,
  HOST,
  PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} from '../constants/env.js';
import { PACKET_TYPE_LENGTH, PACKET_LENGTH } from '../constants/header.js';
import { PACKET_ID, reverseMapping } from '../constants/packetId.js';
import { REDIS_URL, REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } from '../constants/env.js';

const config = {
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
  redis: {
    url: REDIS_URL,
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
  },
};

export default config;
