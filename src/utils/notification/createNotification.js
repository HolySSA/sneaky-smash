import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';

/**
 * 패킷을 통해 버퍼 생성 후 전송
 * @param {*} message
 * @param {*} type
 * @returns
 */
const makeNotification = (message, type) => {
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
  // const notification = protoMessages.notification~;

  // 수정 필요
  const payloadName = PayloadName[packetType];
  const notificationPacket = notification.encode({ [payloadName]: payload }).finish();

  return makeNotification(notificationPacket, packetType, sequence);
};

export default createNotificationPacket;
