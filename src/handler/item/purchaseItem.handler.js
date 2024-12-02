import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_PurchaseItem {
//     ItemInfo item = 1; // 습득할 아이템 정보
//     int32 gold = 2; // 보유 골드 - 아이템 골드
//     bool success = 3; // 성공여부
//     string message = 4; // 메시지
//   }
const purchaseItemHandler = async (socket, payload) => {
  try {
    const { item, gold, success, message } = payload;

    const purchaseItemPayload = {
      item,
      gold,
      success,
      message,
    };

    const response = createResponse(PACKET_ID.S_PurchaseItem, purchaseItemPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default purchaseItemHandler;
