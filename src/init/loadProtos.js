import fs from 'fs';
import path from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';

// import.meta.url을 사용하여 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("파일 경로: " + __dirname);

const protoDir = path.join(__dirname, '../protobuf'); // 프로젝트 구조에 맞게 경로 설정
const protoMessages = {};

// 디렉토리 순회 함수 (재귀)
const getAllProtoFiles = (dir) => {
    let protoFiles = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // 하위 디렉토리 재귀 호출
            protoFiles = protoFiles.concat(getAllProtoFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.proto')) {
            protoFiles.push(fullPath);
        }
    }

    return protoFiles;
};

const loadProtos = async () => {
    try {
        const protoFiles = getAllProtoFiles(protoDir); // 모든 .proto 파일 찾기

        if (protoFiles.length === 0) {
            throw new Error('디렉토리 및 하위 디렉토리에 .proto 파일이 없습니다.');
        }

        const root = new protobuf.Root(); // Protobuf 루트 객체 생성

        for (const filePath of protoFiles) {
            await root.load(filePath); // 각 파일 로드

            // 로드된 메시지 타입을 protoMessages에 저장
            for (const typeName of Object.keys(root.nested)) {
                const nestedItem = root.lookup(typeName);
                if (nestedItem instanceof protobuf.Type) {
                    protoMessages[typeName] = nestedItem; // 메시지 타입 저장
                }
            }
        }

        console.log('프로토콜 버퍼 파일이 성공적으로 로드되었습니다:', Object.keys(protoMessages));
    } catch (err) {
        console.error('프로토콜 버퍼 파일 로드 중 오류:', err);
        throw err;
    }
};

// protoMessages 객체 반환 함수
const getProtoMessages = () => {
    if (Object.keys(protoMessages).length === 0) {
        throw new Error('프로토콜 버퍼 메시지가 로드되지 않았습니다. loadProtos()를 먼저 호출하세요.');
    }
    return protoMessages;
};

// 시작 시 자동으로 프로토 파일 로드
export { getProtoMessages, loadProtos };
