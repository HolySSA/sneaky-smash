import dbPool from '../database.js'; // DB 커넥션
import SQL_QUERIES from './characters.query.js'; // Character 관련 SQL 쿼리들
import toCamelCase from '../../utils/transformCase.js'; // toCamelCase import

// 캐릭터 생성
export const createCharacter = async (userId, nickname, myClass, gold = 0) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_CHARACTER, [
    userId,
    nickname,
    myClass,
    gold,
  ]);
  return { id: result.insertId };
};

// 사용자 ID로 캐릭터 찾기
export const findCharacterByUserId = async (userId) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_CHARACTER_BY_USERID, [userId]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 캐릭터 조회
export const findAllCharacters = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_CHARACTERS);
  return rows.map(toCamelCase);
};

// 캐릭터 수정
export const updateCharacter = async (userId, nickname, myClass, gold) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_CHARACTER, [
    nickname,
    myClass,
    gold,
    userId,
  ]);
  return { affectedRows: result.affectedRows };
};

// 캐릭터 삭제
export const deleteCharacter = async (userId) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_CHARACTER, [userId]);
  return { affectedRows: result.affectedRows };
};
