import { CLIENT_VERSION, HOST, PORT } from '../constants/env.js';
import { HANDLER_IDS } from '../constants/handlerIds.js';
import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';

const config = {
  server: {
    host: HOST,
    port: PORT,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: TOTAL_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
    type: {
      ping: PACKET_TYPE.PING,
      normal: PACKET_TYPE.NORMAL,
    },
  },
  handlerIds: {
    initial: HANDLER_IDS.INITIAL,
  },
};

export default config;
