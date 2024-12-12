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
  account: 'test1234',
  password: 'test1234',
});
client.addHandler(PACKET_ID.S_PartyJoin, async (payload) => {
  //console.log(payload);
});
client.sendMessage(PACKET_ID.C_PartyJoin, {
  dungeonLevel: 1,
  roomId: 1,
  isOwner: false,
});
client.addHandler(PACKET_ID.S_PartyLeave, async (payload) => {
  //console.log(payload);
});
client.addHandler(PACKET_ID.S_PartyLeave, async (payload) => {
  //console.log(payload);
});
setTimeout(() => {
  client.sendMessage(PACKET_ID.C_PartyLeave, {
    roomId: 1,
  });
}, 2000);

/*
message C_PartyJoin {
  int32 dungeonLevel = 1;  // 던전 난이도
  int32 roomId = 2;
  bool isOwner = 3;
}

message S_PartyJoin {
	int32 playerId = 1;
	int32 roomId = 2;
	int32 dungeonLevel = 3;
}
*/
