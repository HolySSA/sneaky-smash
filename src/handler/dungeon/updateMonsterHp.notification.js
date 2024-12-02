import createResponse from '../../utils/response/createResponse.js';
import handleError from '../../utils/error/errorHandler.js';
import { PACKET_ID } from '../../constants/packetId.js';

const updateMonsterHpNotification = (socket, payload) => {
  try {
  } catch (err) {
    handleError(err);
  }
};

export default updateMonsterHpNotification;
