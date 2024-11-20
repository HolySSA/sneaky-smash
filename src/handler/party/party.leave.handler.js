import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { leaveParty } from '../../utils/redis/party.session.js';
import { getUserById } from '../../utils/redis/user.session.js';

// // **C_PartyLeave** - 파티에서 나가기 요청 메시지
// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }
// // **S_Party** - 파티 정보 응답 메시지
// message S_Party {
//   repeated int32 playerId = 1;    // 파티에 참여 중인 유저들의 ID 리스트
//   int32 roomId = 2;         // 던전 난이도
// }

const partyLeaveHandler = async (socket, payload) => {
  try {
    const { roomId } = payload;

    // 해당 유저를 뺀 파티원들
    const members = await leaveParty(roomId, socket.id);

    // 페이로드
    const partyPayload = {
      playerId: members,
      roomId,
    };

    const response = createResponse(PACKET_ID.S_Party, partyPayload);

    members.forEach((member) => {
      const user = getUserById(member);

      user.socket.write(response);
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
