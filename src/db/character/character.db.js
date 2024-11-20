import toCamelCase from '../../utils/transformCase.js';
import dbPool from '../database.js';
import { SQL_QUERIES } from './character.query.js';

// 캐릭터 생성하기
export const addCharacter = async (userId, nickname, myClass, gold) => {
  const [result] = await dbPool.query(SQL_QUERIES.ADD_CHARACTER, [userId, nickname, myClass, gold]);
  return { id: result.insertId, userId, nickname, myClass, gold };
};

// 해당 유저 캐릭터 불러오기
export const getCharacterByUserId = async (userId) => {
  const [rows] = await dbPool.query(SQL_QUERIES.GET_CHARACTER_BY_USER_ID, [userId]);
  return toCamelCase(rows[0]);
};

// 특정 캐릭터 정보를 업데이트
export const updateCharacter = async (id, updates) => {
  const { nickname, myClass, gold } = updates;
  await dbPool.query(SQL_QUERIES.UPDATE_CHARACTER, [nickname, myClass, gold, id]);
  return { id, ...updates };
};

// 캐릭터 삭제하기
export const deleteCharacter = async (id) => {
  await dbPool.query(SQL_QUERIES.DELETE_CHARACTER, [id]);
  return { id };
};
