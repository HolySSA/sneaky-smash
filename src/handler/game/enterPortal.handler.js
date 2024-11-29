import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';

// 패킷명세
// message C_EnterPortal {
//     int32 potalId = 1;  // 포탈 고유 ID
// }

// message S_EnterPortal {
//     int32 potalId = 1;  // 포탈 고유 ID
//     int32 statId = 2;   // 버프/디버프 ID
//     int32 stat = 3;     // 버프/디버프
// }

const enterPortalHandler = async (socket, payload) => {
  try {
    const { potalId } = payload;

    const enterPortalpayload = {
      potalId,
      statId,
      stat,
    };

    const response = createResponse(PACKET_ID.S_EnterPortal, enterPortalpayload);
    socket.write(response);

    global.connectedSockets.forEach((clientSocket) => {
      if (clientSocket !== socket) {
        clientSocket.write(response);
      } 
    });

  } catch (e) {
    handleError(socket, e);
  }
};

export default enterPortalHandler;
