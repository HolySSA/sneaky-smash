import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getUserSessionById } from '../../sessions/user.session.js';
// 패킷명세
// message C_Inventory {
// }
// message S_Inventory {
//     repeated ItemInfo items = 1;  // 인벤토리 내 아이템 리스트
// }
// message ItemInfo {
//   int32 itemId = 1; // 아이템 ID
//   int32 quantity = 2; // 아이템 수량
// }

const inventoryHandler = (socket, payload) => {
  try {
    // userSession에 저장했을 경우
    const userSession = getUserSessionById(socket.id);

    if (!userSession.inventory) {
      return;
    }

    // parseInt는 데이터 세션에서도 int로 처리해주지만 혹시모르니 넣어놨습니다.
    const items = userSession.inventory.map((item) => ({
      itemId: parseInt(item.itemId),
      quantity: parseInt(item.amount),
    }));

    const inventoryPayload = {
      items: items,
    };

    const response = createResponse(PACKET_ID.S_Inventory, inventoryPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default inventoryHandler;
