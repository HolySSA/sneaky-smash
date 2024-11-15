import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';

// 현재 파일의 절대경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 상위 경로 + protobuf 폴더
const protoDir = path.join(__dirname, '../protobuf');

const protoFiles = getAllProtoFiles(protoDir);
const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const [namespace, types] of Object.entries(packetNames)) {
      protoMessages[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[namespace][type] = root.lookupType(typeName);
      }
    }

    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (err) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', err);
  }
};

export const getProtoMessages = () => {
  // console.log('protoMessages:', protoMessages);

  return { ...protoMessages };
};
