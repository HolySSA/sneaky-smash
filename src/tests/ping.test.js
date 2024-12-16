import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
const { PACKET_ID } = configs;

await import('./login.test.js');
const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

client.addHandler(PACKET_ID.S_Ping, async ({ payload }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  client.sendMessage(PACKET_ID.C_Pong, {
    clientTime: Date.now(),
  });
});
