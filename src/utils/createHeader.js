import config from '../config/config.js';

const createHeader = (packetId, buffer) => {
  const packetLength = Buffer.alloc(config.packet.length);
  packetLength.writeUInt32BE(buffer.length + config.packet.length + config.packet.typeLength, 0);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(packetId);

  return Buffer.concat([packetLength, packetType]);
};

export default createHeader;
