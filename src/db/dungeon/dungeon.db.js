import dbPool from '../database.js';
import SQL_QUERIES from './dungeon.query.js';
import handleDbQuery from '../../utils/db/dbHelper.js'; // DB 처리 함수 임포트

// 던전 생성
export const createDungeon = async (stageList) => {
  try {
    // JSON 형식으로 stageList를 쿼리 파라미터로 전달
    const result = await handleDbQuery(dbPool.query.bind(dbPool), [
      SQL_QUERIES.CREATE_DUNGEON,
      JSON.stringify(stageList), // JSON으로 변환하여 전달
    ]);

    return { id: result.insertId, stageList }; // 생성된 던전 반환
  } catch (error) {
    console.error('Error creating dungeon:', error.message);
    throw error;
  }
};

// 던전 조회
export const findDungeonById = async (id) => {
  const row = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_DUNGEON_BY_ID, id]);
  if (!row) {
    throw new Error(`Dungeon with ID ${id} not found.`);
  }
  return row.rows; // 단일 던전 반환
};

// 모든 던전 조회
export const findAllDungeons = async () => {
  const rows = await handleDbQuery(
    dbPool.query.bind(dbPool),
    [SQL_QUERIES.FIND_ALL_DUNGEONS],
    true,
  );
  // isArray = true로 설정하여 여러 결과를 처리
  return rows.rows; // 모든 던전 반환
};

// 던전 수정
// 던전 수정
export const updateDungeon = async (id, stageList) => {
  try {
    // JSON.stringify()로 stageList를 문자열로 변환하여 쿼리 파라미터로 전달
    const result = await handleDbQuery(dbPool.query.bind(dbPool), [
      SQL_QUERIES.UPDATE_DUNGEON,
      JSON.stringify(stageList), // stageList를 JSON 문자열로 변환
      id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error(`Dungeon with ID ${id} not found or no changes made.`);
    }

    return { id, stageList }; // 수정된 던전 반환
  } catch (error) {
    console.error('Error updating dungeon:', error.message);
    throw error;
  }
};

// 던전 삭제
export const deleteDungeon = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_DUNGEON, id]);
  if (result.affectedRows === 0) {
    throw new Error(`Dungeon with ID ${id} not found.`);
  }
  return { id }; // 삭제된 던전의 ID 반환
};
