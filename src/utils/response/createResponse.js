import { getProtoMessages } from '../../init/loadProtos.js';
import config from '../../config/config.js';
import createHeader from '../createHeader.js';

const createResponse = (packetId, data = null) => {
  const protoMessages = getProtoMessages();
  // console.log('protoMessages keys:', Object.keys(protoMessages));

  // key: 숫자 - 패킷 생성
  const response = protoMessages[packetId];

  console.log('packetId: ', packetId);
  // console.log('response: ', response);
  // console.log('data: ', data);
  // const payload = { [packetId]: data };

  const gamePacket = response.create(data);
  const buffer = response.encode(gamePacket).finish();

  // createHeader로 뺄까?
  const header = createHeader(packetId, buffer);

  return Buffer.concat([header, buffer]);
};

export default createResponse;
