import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
import { PACKET_ID } from '../configs/constants/packetId.js';

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();
client.addHandler(PACKET_ID.S_Authorize, async (payload) => {
  //console.log(payload);
});
client.sendMessage(PACKET_ID.C_Authorize, {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI2IiwiaWF0IjoxNzM0NDAwODIwLCJleHAiOjE3MzQ1NzM2MjAsImF1ZCI6InNwYXJ0YSIsImlzcyI6Im11bHRpcGxlcm9ndWVsaWtlIn0.UT4c9akiNfPgxznSH7nAA2ZCSl8wk2i0n2ttK9QIxTA',
});
