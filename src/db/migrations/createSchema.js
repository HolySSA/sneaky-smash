import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbPool from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');

  const sqlFiles = [
    'user_db.sql',
    'characters_db.sql',
    'inventoryItem_db.sql',
    'boss_db.sql',
    'dungeon_db.sql',
    'equipment_db.sql',
    'item_db.sql',
    'monsters_db.sql',
    'skill_db.sql',
    'stage_db.sql',
  ]; // 여러 SQL 파일을 처리

  try {
    // 각 SQL 파일을 하나씩 읽고 쿼리 실행
    for (const sqlFile of sqlFiles) {
      const filePath = path.join(sqlDir, sqlFile); // 각 파일 경로
      console.log(`Reading SQL file: ${filePath}`);

      // 파일 내용을 읽음
      const sql = fs.readFileSync(filePath, 'utf8');

      // SQL 쿼리로 분할하여 실행
      const queries = sql
        .split(';')
        .map((query) => query.trim())
        .filter((query) => query.length > 0);

      // 각 쿼리 실행
      for (const query of queries) {
        await dbPool.query(query);
      }

      console.log(`${sqlFile} 테이블 생성 완료`);
    }

    console.log('모든 데이터베이스 테이블 생성 성공');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 에러: ', error);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션 완료');
    process.exit(0); // 마이그레이션 완료 후 프로세스 종료
  })
  .catch((error) => {
    console.error('마이그레이션 실행 오류: ', error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
