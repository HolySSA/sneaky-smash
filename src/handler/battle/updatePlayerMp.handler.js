import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// 플레이어 마나 업데이트 (S_UpdatePlayerMp)
// message S_UpdatePlayerMp {
//     float mp = 1;                // 플레이어의 마나
//   }

const updatePlayerMpHandler = async (socket, payload) => {
  try {
    const { mp } = payload;

    const updatePlayerMpPayload = {
      mp,
    };

    const response = createResponse(PACKET_ID.S_UpdatePlayerMp, updatePlayerMpPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default updatePlayerMpHandler;
