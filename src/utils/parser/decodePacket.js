import { getProtoMessages } from '../../init/loadProtos.js';

const decodeMessageByPacketId = (packetId, buffer) => {
  const protoMessages = getProtoMessages();

  const type = protoMessages[packetId];
  if (!type) {
    throw new Error(`패킷 ID ${packetId}에 대한 Protobuf 타입이 없습니다.`);
  }

  // 필드 검증 로직 추가
  const expectedFields = Object.keys(type.fields);

  try {
    // 버퍼 데이터를 디코드
    const decoded = type.decode(buffer);

    // 필드 검증
    const actualFields = Object.keys(decoded);
    const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
    if (missingFields.length > 0) {
      throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
    }

    return decoded.toJSON(); // JSON 형식으로 변환 후 반환
  } catch (error) {
    throw new Error(`패킷 ID ${packetId} 디코딩 실패: ${error.message}`);
  }
};

export default decodeMessageByPacketId;
