import net from 'net';
import protobuf from 'protobufjs';
import config from './src/config/config.js';
import { PACKET_ID } from './src/constants/packetId.js';
// message C_HitPlayer{
//     int32 playerId = 1;  // 공격자 ID
//     int32 damage = 2;    // 데미지
//   }
//   // 플레이어 공격 알림
//   message S_HitPlayer{

const S_HitPlayer = `
message C_HitMonster {
  int32 playerId = 1;  // 공격 유저ID
  int32 damage = 2;    // 데미지
}

message S_HitMonster {
  int32 playerId = 1;  // 공격 유저ID
  int32 damage = 2;    // 데미지
}

`;

// .proto 파일 경로
const PROTO_PATH = './src/protobuf/dungeon/battle.proto';

// 패킷 생성 및 전송 함수
async function loadProtoAndSend(packetType, messageType, payload) {
  try {
    // .proto 파일 로드
    const root = await protobuf.load(PROTO_PATH);
    const Message = root.lookupType('C_HitMonster');

    // 페이로드 검증
    const errMsg = Message.verify(payload);
    if (errMsg) {
      throw new Error(`잘못된 페이로드: ${errMsg}`);
    }

    // 페이로드 인코딩
    const messageBuffer = Message.encode(Message.create(payload)).finish();

    // 4바이트 길이 + 1바이트 패킷 타입 + 페이로드
    const packetLength = 1 + messageBuffer.length;
    const buffer = Buffer.alloc(4 + packetLength);

    buffer.writeUInt32BE(packetLength, 0); // 패킷 길이
    buffer.writeUInt8(packetType, 4); // 패킷 타입

    messageBuffer.copy(buffer, 5); // 페이로드 복사

    // TCP 소켓 연결
    const client = new net.Socket();
    client.connect(config.server.port, config.server.host, () => {
      console.log(`${messageType} 메시지를 서버로 전송합니다.`);
      console.log(`${JSON.stringify(payload, null, 2)}`);
      client.write(buffer);
    });

    // 동적으로 프로토타입 로드
    const handlers = {
      [PACKET_ID.S_HitMonster]: root.lookupType('S_HitMonster'),
      [PACKET_ID.S_UpdateMonsterHp]: root.lookupType('S_UpdateMonsterHp'),
      [PACKET_ID.S_LevelUp]: root.lookupType('S_LevelUp'),
    };

    // 서버 응답 처리
    client.on('data', (data) => {
      console.log('데이터:', data);

      // payload만 남기기
      const payloadBuffer = data.subarray(5);

      // 패킷 ID
      const packetId = data.readUInt8(4);
      console.log('받은 패킷 ID:', packetId);

      // S_Register 디코딩
      const handler = handlers[packetId];
      if (handler) {
        const decoded = handler.decode(payloadBuffer);
        console.log(`Decoded data for packet ID ${packetId}:`, JSON.stringify(decoded, null, 2));
      } else {
        console.log(`Unhandled packet ID: ${packetId}`);
      }

      // client.destroy(); // 응답 수신 후 연결 종료
    });

    client.on('close', () => {
      console.log('연결 종료');
    });

    client.on('error', (err) => {
      console.error('오류 발생:', err.message);
    });
  } catch (error) {
    console.error('패킷 전송 실패:', error.message);
  }
}

// 사용 예제
// float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;
(async () => {
  const messageType = 'C_HitMonster'; // 전송할 메시지 타입
  const payload = {
    monsterId: 1,
    damage: 100,
  }; // 전송할 페이로드
  const packetType = PACKET_ID.C_HitMonster; // 패킷 타입

  await loadProtoAndSend(packetType, messageType, payload);
})();
