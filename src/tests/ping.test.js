import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PacketType } = configs;

await import('./gameAuthorize.test.js');
const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

client.addHandler(PacketType.PING_REQUEST, async ({ payload }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  client.sendMessage(PacketType.PONG_RESPONSE, {
    clientTime: Date.now(),
  });
});
