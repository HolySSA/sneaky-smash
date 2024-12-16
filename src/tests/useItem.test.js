import net from 'net';
import protobuf from 'protobufjs';
import { PACKET_ID } from '../constants/packetId.js';
import logger from '../utils/logger.js';

// 프로토 정의
const ItemProto = `
syntax = "proto3";

message ItemInfo {
  int32 itemId = 1;
  int32 atk = 2;
  int32 def = 3;
  int32 curHp = 4;
  int32 maxHp = 5;
  int32 moveSpeed = 6;
  int32 criticalProbability = 7;
  int32 criticalDamageRate = 8;
}

message C_UseItem {
  int32 itemId = 1;
}

message S_UseItem {
  int32 playerId = 1;
  ItemInfo itemInfo = 2;
}
`;

async function testUseItem() {
  try {
    const root = protobuf.Root.fromJSON(JSON.parse(JSON.stringify(protobuf.parse(ItemProto).root)));

    const C_UseItemMessage = root.lookupType('C_UseItem');
    const S_UseItemMessage = root.lookupType('S_UseItem');

    // 모의 socket 객체 생성
    const socket = {
      id: 'test-socket-id',
      write: (data) => {
        logger.info('서버로 전송된 데이터:', data);
      },
    };

    // 테스트용 페이로드
    const payload = {
      itemId: 100, // 테스트용 아이템 ID
    };

    // 페이로드 검증
    const errMsg = C_UseItemMessage.verify(payload);
    if (errMsg) {
      throw new Error(`잘못된 페이로드: ${errMsg}`);
    }

    // 패킷 생성
    const messageBuffer = C_UseItemMessage.encode(C_UseItemMessage.create(payload)).finish();
    const packetLength = 1 + messageBuffer.length;
    const buffer = Buffer.alloc(4 + packetLength);

    buffer.writeUInt32BE(packetLength, 0);
    buffer.writeUInt8(PACKET_ID.C_UseItem, 4);
    messageBuffer.copy(buffer, 5);

    logger.info('아이템 사용 요청을 전송합니다:', payload);
    socket.write(buffer);

    // 서버 응답 모의 처리
    const responseBuffer = Buffer.from([0, 0, 0, 0, PACKET_ID.S_UseItem, ...messageBuffer]);
    const decoded = S_UseItemMessage.decode(responseBuffer.subarray(5));
    logger.info('아이템 사용 결과:', JSON.stringify(decoded, null, 2));
  } catch (error) {
    logger.error('테스트 실행 중 오류 발생:', error);
  }
}

// 테스트 실행
(async () => {
  logger.info('아이템 사용 테스트를 시작합니다...');
  await testUseItem();
  logger.info('테스트가 완료되었습니다.');
})();
