import dbPool from '../database.js';
import SQL_QUERIES from '../query/user.query.js';
import toCamelCase from '../../utils/transformCase.js';

// 사용자 생성
export const createUser = async (account, password) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_USER, [account, password]);
  return { id: result.insertId };
};

// 아이디로 사용자 찾기
export const findUserByAccount = async (account) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT, [account]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 사용자 조회
export const findAllUsers = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_USERS);
  return rows.map(toCamelCase);
};

// 사용자 수정
export const updateUser = async (id, account, password) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_USER, [account, password, id]);
  return { affectedRows: result.affectedRows };
};

// 사용자 삭제
export const deleteUser = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_USER, [id]);
  return { affectedRows: result.affectedRows };
};
