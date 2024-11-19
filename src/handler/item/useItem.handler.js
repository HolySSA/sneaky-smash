import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세

const useItemHandler = async (socket, payload) => {
  try {
    const { item } = payload;

    const useItemPayload = {
      item,
    };

    const response = createResponse(PACKET_ID.S_UseItem, useItemPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default useItemHandler;
