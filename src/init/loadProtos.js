import path from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';
import { reverseMapping } from '../constants/packetId.js';
import getAllProtoFiles from './protofiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoDir = path.join(__dirname, '../protobuf'); // .proto 파일이 저장된 디렉토리
const protoMessages = {}; // 패킷 ID -> Protobuf 타입 매핑을 저장

// 모든 Protobuf 타입을 미리 로드하고, 패킷 ID와 매핑
const loadProtos = async () => {
  try {
    const protoFiles = getAllProtoFiles(protoDir);

    if (protoFiles.length === 0) {
      throw new Error('디렉토리 또는 하위 디렉토리에 .proto 파일이 없습니다.');
    }

    const root = new protobuf.Root(); // Protobuf 루트 객체

    /*
    for (const filePath of protoFiles) {
      await root.load(filePath); // 각 .proto 파일 로드
    }
    */
    // 비동기 병렬 처리로 속도 개선
    await Promise.all(protoFiles.map((file) => root.load(file)));

    console.log('Protobuf 파일이 성공적으로 로드되었습니다.');

    // reverseMapping을 기반으로 패킷 ID와 Protobuf 타입 매핑
    for (const [packetId, typeName] of Object.entries(reverseMapping)) {
      const type = root.lookupType(typeName);

      if (type && type instanceof protobuf.Type) {
        protoMessages[packetId] = type; // Protobuf 타입을 protoMessages에 저장
      } else {
        console.warn(`"${typeName}" 타입이 로드된 Protobuf 파일에서 찾을 수 없습니다.`);
      }
    }

    // console.log('protoMessages:', protoMessages);
  } catch (err) {
    console.error('Protobuf 파일 로드 중 오류:', err.message);
    throw err;
  }
};

// 패킷 ID를 기반으로 메시지를 디코드하는 함수 -- 검증 로직을 아예 빼버려서 필수 검증이라도 추가
const decodeMessageByPacketId = (packetId, buffer) => {
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

// 함수 내보내기
export { loadProtos, decodeMessageByPacketId };
