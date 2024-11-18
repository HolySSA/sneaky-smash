import { getProtoMessages } from '../../init/loadProtos.js';
import config from '../../config/config.js';

const makeNotification = (packetId, buffer) => {
  // packet header
  const packetLength = Buffer.alloc(config.packet.length);
  packetLength.writeUInt32BE(buffer.length + config.packet.length + config.packet.typeLength, 0);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(packetId);

  return Buffer.concat([packetLength, packetType, buffer]);
};

const createNotificationPacket = (packetId, data = null) => {
  const protoMessages = getProtoMessages();

  // key: 숫자 - 패킷 생성
  const notification = protoMessages[packetId];
  const gamePacket = notification.create(data);
  const buffer = notification.encode(gamePacket).finish();

  return makeNotification(packetId, buffer);
};

export default createNotificationPacket;
