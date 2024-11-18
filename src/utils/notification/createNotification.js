import { getProtoMessages } from '../../init/loadProtos.js';
import config from '../../config/config.js';

const makeNotification = (message, type) => {
  // createHeader로 뺄까?
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

const createNotificationPacket = (payload, packetType, sequence) => {
  const protoMessages = getProtoMessages();

  // key: 숫자 - 패킷 생성
  const notification = protoMessages[packetId];
  const payload = { [packetId]: data };
  const gamePacket = notification.create(payload);
  const buffer = notification.encode(gamePacket).finish();

  const notificationPacket = notification.encode(payload).finish();

  return makeNotification(notificationPacket, packetType, sequence);
};

export default createNotificationPacket;
