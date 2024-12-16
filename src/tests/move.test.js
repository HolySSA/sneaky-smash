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
    account : "test123",
    password : "test123"
});
client.addHandler(PACKET_ID.S_Move, async (payload) => {
  //console.log(payload);
});
client.sendMessage(PACKET_ID.C_Move, {
    transform : {posX : 1, posY : 1, posZ : 1, rot : 100},
    
});