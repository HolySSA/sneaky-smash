import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_EquipEquipment {
//     int32 itemId = 1; // 장착한 장비 ID
//   }
const equipEquipmentHandler = async (socket, payload) => {
  try {
    const { itemId } = payload;

    const equipEquipmentPayload = {
      itemId,
    };

    const response = createResponse(PACKET_ID.S_EquipEquipment, equipEquipmentPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default equipEquipmentHandler;
