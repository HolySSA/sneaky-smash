import configs from '../configs/config.js';
import { PACKET_ID } from '../configs/constants/packetId.js';
import { getHandlerByPacketId } from '../handler/index.js';
import decodeMessageByPacketId from '../utils/packet/decodePacket.js';
import logger from '../utils/logger.js';

const { PACKET_LENGTH, PACKET_TYPE_LENGTH, PACKET_TOTAL_LENGTH } = configs;

const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= PACKET_TOTAL_LENGTH) {
    const packetLength = socket.buffer.readUIntBE(0, PACKET_LENGTH);
    const packetType = socket.buffer.readUIntBE(PACKET_LENGTH, PACKET_TYPE_LENGTH);

    if (socket.buffer.length >= packetLength) {
      const packet = socket.buffer.subarray(PACKET_TOTAL_LENGTH, packetLength);
      socket.buffer = socket.buffer.subarray(packetLength);

      try {
        const decodedMessage = decodeMessageByPacketId(packetType, packet);

        if (packetType !== PACKET_ID.C_Move) {
          logger.info(`패킷 ID ${packetType}의 디코드 결과:`, decodedMessage);
        }

        const handler = getHandlerByPacketId(packetType);
        await handler(socket, decodedMessage);
      } catch (err) {
        // handleError(socket, err);
        logger.error(err);
      }
    } else {
      break;
    }
  }
};

export default onData;
