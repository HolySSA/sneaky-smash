import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PACKET_ID } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

client.addHandler(PACKET_ID.S_Login, async ({ payload }) => {
  if (payload.success == true) {
    client.token = payload.token;
    client.expirationTime = payload.expirationTime;
  } else {
    client.token = undefined;
    client.expirationTime = 0;
  }
});

client.sendMessage(PACKET_ID.C_Login, {
  account: testEnv.userName,
  password: testEnv.password,
});
