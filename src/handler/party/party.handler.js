import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisParties } from '../../sessions/redis/redis.party.js';
import handleError from '../../utils/error/errorHandler.js';
import createResponse from '../../utils/response/createResponse.js';

// // 파티 창 입장
// message C_Party {
// }

// // **S_Party** - 파티 정보 응답 메시지
// message S_Party {
//   repeated int32 playerId = 1;    // 파티에 참여 중인 유저들의 ID 리스트
//   int32 roomId = 2;
// 	int32 dungeonLevel = 3; // 던전 난이도
// }

const partyHandler = async (socket, payload) => {
  try {
    const parties = await getRedisParties();

    parties.forEach((party) => {
      const partyPayload = {
        playerId: party.members.map((m) => parseInt(m)),
        roomId: parseInt(party.roomId),
        dungeonLevel: parseInt(party.dungeonLevel),
      };

      const response = createResponse(PACKET_ID.S_Party, partyPayload);
      socket.write(response);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyHandler;
