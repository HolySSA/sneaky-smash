import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';

const { PacketType } = configs;

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();
client.addHandler(PacketType.JOIN_ROOM_RESPONSE, async (payload) => {
  // console.log(payload);
});
client.sendMessage(PacketType.JOIN_ROOM_REQUEST, {
  gameCode: '992518',
});
