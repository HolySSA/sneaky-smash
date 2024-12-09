import { getOrCreateClient } from './client.test.js';
import testEnv from './env.test.js';
import configs from '../configs/configs.js';

const { RefreshTokenResultCode } = configs;
await import('./login.test.js');
const { PacketType } = configs;
await new Promise((resolve) =>
  setTimeout(() => {
    resolve();
  }, 1000),
);
const client = await getOrCreateClient(testEnv.url, testEnv.port);
client.connect();

client.addHandler(PacketType.REFRESH_TOKEN_RESPONSE, async ({ payload }) => {
  if (payload.refreshTokenResultCode === RefreshTokenResultCode.SUCCESS) {
    client.token = payload.token;
    client.expirationTime = payload.expirationTime;
  } else {
    client.token = undefined;
    client.expirationTime = 0;
  }
});
client.sendMessage(PacketType.REFRESH_TOKEN_REQUEST, {
  token: client.token,
});
