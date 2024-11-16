import { CLIENT_VERSION, HOST, PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from '../constants/env.js';
import { PACKET_TYPE_LENGTH, PACKET_LENGTH } from '../constants/header.js';
import { PACKET_ID } from '../constants/packetId.js';

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
    // type: {
    //   cRegister: PACKET_ID.C_Register,
    //   sRegister: PACKET_ID.S_Register,
    //   cLogIn: PACKET_ID.C_LoginIn,
    //   sLogIn: PACKET_ID.S_LoginIn,
    // }
  },
  databases: {
    USER_DB: {
      name: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
    },
    // 필요한 만큼 추가
  },
};

export default config;
