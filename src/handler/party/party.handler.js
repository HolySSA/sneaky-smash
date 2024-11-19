import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// **S_Party** - 파티 정보 응답 메시지
// message S_Party {
//     repeated int32 playerId = 1;    // 파티에 참여 중인 유저들의 ID 리스트
//     int32 dungeonLevel = 2;          // 던전 난이도
//   }
const partyHandler = async (socket, payload) => {
  try {
    const { playerId, dungeonLevel } = payload;

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
