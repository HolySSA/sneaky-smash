import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PacketType, SignInResultCode } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

client.addHandler(PacketType.SIGN_IN_RESPONSE, async ({ payload }) => {
  if (payload.signInResultCode === SignInResultCode.SUCCESS) {
    client.token = payload.token;
    client.expirationTime = payload.expirationTime;
  } else {
    client.token = undefined;
    client.expirationTime = 0;
  }
});

client.sendMessage(PacketType.SIGN_IN_REQUEST, {
  id: testEnv.userName,
  password: testEnv.password,
});
