import { getProtoMessages } from '../../init/loadProtos.js';
import config from '../../config/config.js';
import createHeader from '../createHeader.js';

const makeNotification = (packetId, buffer) => {
  const header = createHeader(packetId, buffer);

  return Buffer.concat([header, buffer]);
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
