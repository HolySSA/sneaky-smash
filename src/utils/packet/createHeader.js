import configs from '../../configs/config.js';
const { length, typeLength } = configs;

const createHeader = (packetId, buffer) => {
  const packetLength = Buffer.alloc(length);
  packetLength.writeUInt32BE(buffer.length + length + typeLength, 0);

  const packetType = Buffer.alloc(typeLength);
  packetType.writeUInt8(packetId);

  return Buffer.concat([packetLength, packetType]);
};

export default createHeader;
