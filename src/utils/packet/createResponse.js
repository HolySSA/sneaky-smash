import { reverseMapping } from '../../configs/constants/packetId.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import createHeader from './createHeader.js';

const createResponse = (packetId, data = null) => {
  const protoMessages = getProtoMessages();

  const protoType = reverseMapping[packetId];
  const response = protoMessages[protoType];
  const gamePacket = response.create(data);
  console.log(data);
  const buffer = response.encode(gamePacket).finish();
  const header = createHeader(packetId, buffer);
  return Buffer.concat([header, buffer]);
};

export default createResponse;
