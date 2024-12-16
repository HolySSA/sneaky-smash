import dbPool from '../database.js';
import SQL_QUERIES from '../query/stage.queries.js';
import toCamelCase from '../../utils/transformCase.js';

// 스테이지 생성
export const createStage = async (monsterId, monsterCount) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_STAGE, [monsterId, monsterCount]);
  return { insertId: result.insertId };
};
// 스테이지 조회
export const findStageById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_STAGE_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 스테이지 조회
export const findAllStages = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_STAGES);
  return rows.map((row) => toCamelCase(row));
};

// 스테이지 수정
export const updateStage = async (id, monsterId, monsterCount) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_STAGE, [monsterId, monsterCount, id]);
  return { affectedRows: result.affectedRows };
};

// 스테이지 삭제
export const deleteStage = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_STAGE, [id]);
  return { affectedRows: result.affectedRows };
};
