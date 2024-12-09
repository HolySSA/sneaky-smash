import configs from '../../configs/config.js';
const { PACKET_LENGTH, PACKET_TYPE_LENGTH, PACKET_TOTAL_LENGTH } = configs;

const createHeader = (packetId, buffer) => {
  const packetLength = Buffer.alloc(PACKET_LENGTH);
  packetLength.writeUInt32BE(buffer.length + PACKET_TOTAL_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(packetId);

  return Buffer.concat([packetLength, packetType]);
};

export default createHeader;
