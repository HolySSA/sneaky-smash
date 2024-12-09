import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';

const { PacketType } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();

client.addHandler(PacketType.MATCH_RESPONSE, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.MATCH_REQUEST, {});
