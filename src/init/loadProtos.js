import path from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';
import { reverseMapping } from '../constants/packetId.js';
import getAllProtoFiles from './protofiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoDir = path.join(__dirname, '../protobuf'); // .proto 파일이 저장된 디렉토리
const protoMessages = {}; // 패킷 ID -> Protobuf 타입 매핑을 저장

const getProtoMessages = () => {
  return { ...protoMessages };
};

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

// 함수 내보내기
export { loadProtos, getProtoMessages };
