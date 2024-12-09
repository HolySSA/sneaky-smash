import { getOrCreateClient } from './client.test.js';
import testEnv from './env.test.js';
import configs from '../configs/configs.js';
await import('./login.test.js');
const { PacketType } = configs;

await new Promise((resolve) =>
  setTimeout(() => {
    resolve();
  }, 1000),
);
const client = await getOrCreateClient(testEnv.url, testEnv.port);
client.connect();

client.addHandler(PacketType.SIGN_OUT_RESPONSE, async ({ payload }) => {});
client.sendMessage(PacketType.SIGN_OUT_REQUEST, {});
