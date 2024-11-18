import { getProtoMessages } from '../../init/loadProtos.js';
import config from '../../config/config.js';

const createResponse = (packetId, data = null) => {
  const protoMessages = getProtoMessages();
  console.log('protoMessages keys:', Object.keys(protoMessages));
  // key: 숫자 - 패킷 생성
  const response = protoMessages[packetId];

  console.log('packetId: ', packetId);
  // console.log('response: ', response);
  // console.log('data: ', data);
  // const payload = { [packetId]: data };

  const gamePacket = response.create(data);
  const buffer = response.encode(gamePacket).finish();

  // createHeader로 뺄까?
  const packetLength = Buffer.alloc(config.packet.length);
  packetLength.writeUInt32BE(buffer.length + config.packet.length + config.packet.typeLength, 0);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(packetId);

  return Buffer.concat([packetLength, packetType, buffer]);
};

export default createResponse;
