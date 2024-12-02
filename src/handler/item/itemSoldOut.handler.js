import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_ItemSoldOut {
//     ItemInfo item = 1; // 판매된 아이템
//   }
const itemSoldOutHandler = async (socket, payload) => {
  try {
    const { item } = payload;

    const itemSoldOutPayload = {
      item,
    };

    const response = createResponse(PACKET_ID.S_ItemSoldOut, itemSoldOutPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default itemSoldOutHandler;
