import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';

// 패킷명세
// // **C_PartyJoin** - 파티에 참여 요청 메시지
// message C_PartyJoin {
//   int32 dungeonLevel = 1;  // 던전 난이도
// }
// **S_Party** - 파티 정보 응답 메시지
// message S_Party {
//     repeated int32 playerId = 1;    // 파티에 참여 중인 유저들의 ID 리스트
//     int32 dungeonLevel = 2;          // 던전 난이도
//   }
const partyHandler = async (socket, payload) => {
  try {
    const { playerId, dungeonLevel } = payload;

    // 파티 세션이나 클래스로 유저 id값 저장해놓기
    // C_Party로 파티 요청 -> S_Party로 해당 파티원들에게 패킷 전달.
    // 방장이 매치 시작하면, 해당 파티원들에게 S_던전들어가기 패킷 전달.

    const partyPayload = {
      playerId,
      dungeonLevel,
    };

    const response = createResponse(PACKET_ID.S_Party, partyPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyHandler;
