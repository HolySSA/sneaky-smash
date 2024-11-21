// import toCamelCase from '../../utils/transformCase.js';
// import dbPool from '../database.js';
// import { SQL_QUERIES } from './user.query.js';

// export const findUserByAccount = async (account) => {
//   const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT, [account]);
//   return toCamelCase(rows[0]);
// };

// export const createUser = async (account, password) => {
//   await dbPool.query(SQL_QUERIES.CREATE_USER, [account, password]);

//   return { account, password };
// };

import dbPool from '../database.js'; // DB 커넥션
import SQL_QUERIES from './user.query.js'; // User 관련 SQL 쿼리들
import handleDbQuery from '../../utils/db/dbHelper.js'; // DB 처리 함수 임포트

// 사용자 생성
export const createUser = async (account, password) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.CREATE_USER,
    account,
    password,
  ]);
  return { id: result.insertId, account, password }; // 생성된 사용자 ID를 포함하여 반환
};

// 아이디로 사용자 찾기
export const findUserByAccount = async (account) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.FIND_USER_BY_ACCOUNT,
    account,
  ]);

  // 단일 사용자 객체가 반환되므로 바로 반환
  return result ? result.rows : null; // 결과가 있으면 반환, 없으면 null
};

// 모든 사용자 조회
export const findAllUsers = async () => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_ALL_USERS], true);
  // 여러 사용자 객체가 반환되므로 rows 배열을 그대로 반환
  return result ? result.rows : []; // 결과가 있으면 반환, 없으면 빈 배열
};

// 사용자 수정
export const updateUser = async (id, updatedData) => {
  const { account, password } = updatedData;
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.UPDATE_USER,
    account,
    password,
    id,
  ]);
  if (result.affectedRows === 0) {
    throw new Error(`User with ID ${id} not found or no changes made.`);
  }
  return { id, ...updatedData }; // 수정된 데이터 반환
};

// 사용자 삭제
export const deleteUser = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_USER, id]);
  if (result.affectedRows === 0) {
    throw new Error(`User with ID ${id} not found.`);
  }
  return { id }; // 삭제된 사용자의 ID 반환
};
