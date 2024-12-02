import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
// 패킷명세
// message S_UnequipWeapon {
//     string itemType = 1; // 탈착한 아이템 유형
//   }
const unequipWeaponHandler = async (socket, payload) => {
  try {
    const { itemType } = payload;

    const unequipWeaponPayload = {
      itemType,
    };

    const response = createResponse(PACKET_ID.S_UnequipWeapon, unequipWeaponPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default unequipWeaponHandler;
