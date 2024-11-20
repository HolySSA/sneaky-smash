import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getParty, leaveParty, removeParty } from '../../utils/redis/party.session.js';
import { getUserById, getUserSessionbyId } from '../../utils/redis/user.session.js';

// message C_PartyLeave {
//   int32 roomId = 1;  // 방 번호
// }

// message S_PartyLeave {
// 	int32 playerId = 1;
// 	int32 roomId = 2;
// }

// message S_Party {
//   repeated int32 playerId = 1;    // 파티에 참여 중인 유저들의 ID 리스트
//   int32 roomId = 2;
// 	int32 dungeonLevel = 3; // 던전 난이도
// }

const partyLeaveHandler = async (socket, payload) => {
  try {
    const { roomId } = payload;

    // 해당 유저를 뺀 파티원들
    const members = await leaveParty(roomId, socket.id);

    const party = await getParty(roomId);
    if (party.owner === socket.id) {
      const payload = {
        playerId: {},
        roomId,
        dungeonLevel: party.dungeonLevel,
      };

      await removeParty();

      const response = createResponse(PACKET_ID.S_Party, payload);

      party.members.forEach((member) => {
        const user = getUserSessionbyId(member);

        user.socket.write(response);
      });

      return;
    }

    // 페이로드
    const partyPayload = {
      playerId: members,
      roomId,
    };

    const response = createResponse(PACKET_ID.S_PartyLeave, partyPayload);

    members.forEach((member) => {
      if (member !== socket.id) {
        const user = getUserById(member);
        user.socket.write(response);
      }
    });
  } catch (e) {
    handleError(socket, e);
  }
};

export default partyLeaveHandler;
