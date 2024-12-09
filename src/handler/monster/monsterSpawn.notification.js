import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';

// message S_MonsterSpawn{
// 	MonsterStatus monsters = 1;
// 	TransformInfo transform = 2;
// 	Stats stats = 3;
// }

// message Stats {
//   int32 atk = 1;
//   int32 def = 2;
//   int32 curHp = 3;
//   int32 maxHp = 4;
//   int32 moveSpeed = 5;
//   int32 criticalProbability = 6;
//   int32 criticalDamageRate = 7
// }

const monsterSpawnNotification = async (socket, { payload }) => {
  try {
    const response = createResponse(PACKET_ID.S_MonsterSpawn, payload);

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export default monsterSpawnNotification;
