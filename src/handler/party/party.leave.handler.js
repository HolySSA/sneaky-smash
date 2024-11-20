import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 dungeonLevel = 1;  // 던전 난이도
// }

const partyLeaveHandler = async (socket, payload) => {
  try {
    const { dungeonLevel } = payload;

    // 해당 파티에서 socket.id 빼기

    // 남은 파티원 정보

    const response = null;
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
