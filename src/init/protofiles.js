import fs from 'fs';
import path from 'path';

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

export default getAllProtoFiles;
