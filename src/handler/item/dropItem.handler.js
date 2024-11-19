import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_DropItem {
//     ItemInfo item = 1; // 버린 아이템 정보
//   }
const dropItemHandler = async (socket, payload) => {
  try {
    const { item } = payload;

    const dropItemPayload = {
      item,
    };

    const response = createResponse(PACKET_ID.S_DropItem, dropItemPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default dropItemHandler;
