// import toCamelCase from '../../utils/transformCase.js';
// import dbPool from '../database.js';
// import { SQL_QUERIES } from './characters.query.js';

// // 캐릭터 생성하기
// export const addCharacter = async (userId, nickname, myClass, gold) => {
//   const [result] = await dbPool.query(SQL_QUERIES.ADD_CHARACTER, [userId, nickname, myClass, gold]);
//   return { userId, nickname, myClass, gold };
// };

// // 해당 유저 캐릭터 불러오기
// export const findCharacterByUserId = async (userId) => {
//   const [rows] = await dbPool.query(SQL_QUERIES.FIND_CHARACTER_BY_USER_ID, [userId]);
//   return toCamelCase(rows[0]);
// };

// // 특정 캐릭터 정보를 업데이트
// export const updateCharacter = async (id, updates) => {
//   const { nickname, myClass, gold } = updates;
//   await dbPool.query(SQL_QUERIES.UPDATE_CHARACTER, [nickname, myClass, gold, id]);
//   return { id, ...updates };
// };

// // 캐릭터 삭제하기
// export const deleteCharacter = async (id) => {
//   await dbPool.query(SQL_QUERIES.DELETE_CHARACTER, [id]);
//   return { id };
// };

import dbPool from '../database.js'; // DB 커넥션
import SQL_QUERIES from './characters.query.js'; // Character 관련 SQL 쿼리들
import handleDbQuery from '../../utils/db/dbHelper.js'; // DB 처리 함수 임포트

// 캐릭터 생성
export const createCharacter = async (userid, nickname, characterClass, gold = 0) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.CREATE_CHARACTER,
    userid,
    nickname,
    characterClass,
    gold,
  ]);
  return { id: result.insertId, userid, nickname, class: characterClass, gold }; // 생성된 캐릭터 정보 반환
};

// 사용자 ID로 캐릭터 찾기
export const findCharacterByUserId = async (userid) => {
  const row = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.FIND_CHARACTER_BY_USERID,
    userid,
  ]);

  return row; // 이미 카멜케이스로 변환된 결과 반환
};

// 모든 캐릭터 조회
export const findAllCharacters = async () => {
  const result = await handleDbQuery(
    dbPool.query.bind(dbPool),
    [SQL_QUERIES.FIND_ALL_CHARACTERS],
    true, // 여러 결과를 반환하기 위한 설정
  );
  return result ? result.rows : []; // rows가 있으면 반환, 없으면 빈 배열
};

// 캐릭터 수정
export const updateCharacter = async (userid, updatedData) => {
  const { nickname, class: characterClass, gold } = updatedData;
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.UPDATE_CHARACTER,
    nickname,
    characterClass,
    gold,
    userid,
  ]);
  if (result.affectedRows === 0) {
    throw new Error(`Character for user with ID ${userid} not found or no changes made.`);
  }
  return { userid, ...updatedData }; // 수정된 데이터 반환
};

// 캐릭터 삭제
export const deleteCharacter = async (userid) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.DELETE_CHARACTER,
    userid,
  ]);
  if (result.affectedRows === 0) {
    throw new Error(`Character for user with ID ${userid} not found.`);
  }
  return { userid }; // 삭제된 캐릭터의 사용자 ID 반환
};
