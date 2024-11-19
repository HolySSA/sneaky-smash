import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_MonsterSpawn {
//     repeated MonsterStatus monsters = 1; // 몬스터 정보
//     repeated int32 amount = 2; // 몬스터 마리수
//   }

const monsterSpawnHandler = async (socket, payload) => {
  try {
    const { monsters, amount } = payload;

    const monsterSpawnPayload = {
      monsters,
      amount,
    };
    const response = createResponse(PACKET_ID.S_MonsterSpawn, monsterSpawnPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default monsterSpawnHandler;
