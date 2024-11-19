import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_Inventory {
//     repeated ItemInfo items = 1;  // 인벤토리 내 아이템 리스트
// }
const inventoryHandler = async (socket, payload) => {
  try {
    const { items } = payload;

    const inventoryPayload = {
      items,
    };
    const response = createResponse(PACKET_ID.S_Inventory, inventoryPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default inventoryHandler;
