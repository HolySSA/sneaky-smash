import net from 'net';
import protobuf from 'protobufjs';
import { PACKET_ID } from './src/constants/packetId.js';
import config from './src/config/config.js';
// import handleError from './src/utils/error/errorHandler.js';
// import { transform } from 'lodash';

const PROTO_PATH = ' ./src/protobuf/town/town.proto';

async function loadProtoAndSend(packetType, messageType, payload) {
  try {
    const root = await protobuf.load(PROTO_PATH);
    const Message = root.lookupType(messageType);

    //페이로드 검증
    const errMsg = Message.verify(payload);
    if (errMsg) {
      throw new Error(`페이로드 오류: ${errMsg}`);
    }
    const messageBuffer = Message.encode(Message.create(payload)).finish();

    const packetLength = 1 + messageBuffer.length;
    const buffer = Buffer.alloc(4 + packetLength);
    buffer.writeUInt32BE(packetLength, 0);
    buffer.writeInt8(packetType, 4);
    messageBuffer.copy(buffer, 5);

    const client = new net.Socket();
    client.connect(config.server.port, config.server.host, () => {
      console.log(`${messageType} 숴붜`);
      client.write(buffer);
    });
    client.on('data', (data) => {
      console.log('숴붜응돱성궝');
      console.log(data, toString());
    });
    client.on('close', () => {
      console.log('연결닫');
    });
    client.on('error', (err) => {
      console.log(`연결에러 :`, err.message);
    });
  } catch (error) {
    console.error('패킷 전송실패', error.message);
    // handleError(socket, e);
  }
}

(async () => {
  const messageType = 'C_Move';
  const payload = {
    transform: {
      posX: 10.0,
      posY: 5.0,
      posZ: 3.0,
      rot: 45.0,
    },
  };
  const packetType = PACKET_ID.C_Move;
  await loadProtoAndSend(packetType, messageType, payload);
})();
