import fs from 'fs';
import path from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';
import { PACKET_ID, reverseMapping } from '../constants/packetId.js';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoDir = path.join(__dirname, '../protobuf'); // .proto 파일이 저장된 디렉토리
const protoMessages = {}; // 패킷 ID -> Protobuf 타입 매핑을 저장
let root; // 로드된 Protobuf의 루트 객체

// 디렉토리를 순회하며 모든 .proto 파일을 가져오는 함수
const getAllProtoFiles = (dir) => {
    let protoFiles = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            protoFiles = protoFiles.concat(getAllProtoFiles(fullPath)); // 하위 디렉토리도 순회
        } else if (entry.isFile() && entry.name.endsWith('.proto')) {
            protoFiles.push(fullPath); // .proto 파일만 추가
        }
    }

    return protoFiles;
};

// 모든 Protobuf 타입을 미리 로드하고, 패킷 ID와 매핑
const loadProtos = async () => {
    try {
        const protoFiles = getAllProtoFiles(protoDir);

        if (protoFiles.length === 0) {
            throw new Error('디렉토리 또는 하위 디렉토리에 .proto 파일이 없습니다.');
        }

        root = new protobuf.Root(); // Protobuf 루트 객체 생성
        for (const filePath of protoFiles) {
            await root.load(filePath); // 각 .proto 파일 로드
        }

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

// 패킷 ID를 기반으로 메시지를 디코드하는 함수
const decodeMessageByPacketId = (packetId, buffer) => {
    const type = protoMessages[packetId];
    if (!type) {
        throw new Error(`패킷 ID ${packetId}에 대한 Protobuf 타입이 없습니다.`);
    }

    try {
        // 버퍼 데이터를 디코드
        const decoded = type.decode(buffer);
        return decoded.toJSON(); // JSON 형식으로 변환 후 반환
    } catch (error) {
        throw new Error(`패킷 ID ${packetId} 디코딩 실패: ${error.message}`);
    }
};

// 함수 내보내기
export { loadProtos, decodeMessageByPacketId };
