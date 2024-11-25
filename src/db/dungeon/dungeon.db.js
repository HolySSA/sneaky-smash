import dbPool from '../database.js';
import SQL_QUERIES from './dungeon.queries.js';
import toCamelCase from '../../utils/transformCase.js';

// 던전 생성
export const createDungeon = async (stageList) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_DUNGEON, [JSON.stringify(stageList)]);
  return { insertId: result.insertId };
};

// 던전 조회
export const findDungeonById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_DUNGEON_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 던전 조회
export const findAllDungeons = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_DUNGEONS);
  return rows.map((row) => toCamelCase(row));
};

// 던전 수정
export const updateDungeon = async (id, stageList) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_DUNGEON, [JSON.stringify(stageList), id]);
  return { affectedRows: result.affectedRows };
};

// 던전 삭제
export const deleteDungeon = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_DUNGEON, [id]);
  return { affectedRows: result.affectedRows };
};
