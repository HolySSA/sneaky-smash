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
  account: 'test123',
  password: 'test123',
});
client.addHandler(PACKET_ID.S_PartyJoin, async (payload) => {
  //console.log(payload);
});
client.sendMessage(PACKET_ID.C_PartyJoin, {
  dungeonLevel: 1,
  roomId: 2,
  isOwner: true,
});
client.addHandler(PACKET_ID.S_PartyLeave, async (payload) => {
  //console.log(payload);
});

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
