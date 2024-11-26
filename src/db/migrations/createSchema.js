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
    // 먼저 데이터베이스가 존재하는지 확인
    const [rows] = await dbPool.query("SHOW DATABASES LIKE 'USER_DB'");
    if (rows.length === 0) {
      // 데이터베이스가 없다면 생성
      await dbPool.query('CREATE DATABASE USER_DB');
      console.log('USER_DB 데이터베이스가 생성되었습니다.');
    } else {
      console.log('USER_DB 데이터베이스가 이미 존재합니다.');
    }

    // 이제 USER_DB 데이터베이스를 사용하도록 설정
    await dbPool.query('USE USER_DB');

    let sql = '';
    // sqlFiles 배열의 모든 파일을 읽고 sql 변수에 합침
    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      sql += fileContent + '\n'; // 파일 내용 합치기
    }
    const queries = sql
      .split(';')
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    for (const query of queries) {
      await dbPool.query(query);
    }

    console.log('데이터베이스 테이블 생성 성공');
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
