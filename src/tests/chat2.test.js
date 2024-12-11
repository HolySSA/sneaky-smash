import Client from './client.test.js';
import { getOrCreateClient } from './client.test.js';
import configs from '../configs/configs.js';
import testEnv from './env.test.js';
import { PACKET_ID } from '../configs/constants/packetId.js';

const client = getOrCreateClient(testEnv.url, testEnv.port);
await client.connect();
client.addHandler(PACKET_ID.S_Login, async (payload) => {
    //console.log(payload);
  });
client.sendMessage(PACKET_ID.C_Login, {
    account : "test1234",
    password : "test1234"
});
client.addHandler(PACKET_ID.S_Chat, async (payload) => {
  //console.log(payload);
});
client.sendMessage(PACKET_ID.C_Chat, {
    chatMsg: "바이~",
});