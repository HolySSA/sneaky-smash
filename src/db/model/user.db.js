import dbPool from '../database.js';
import SQL_QUERIES from '../query/user.query.js';
import toCamelCase from '../../utils/transformCase.js';
import {
  getAccountByRedis,
  setAccountByRedis,
  unlinkAccountByRedis,
} from '../../sessions/redis/redis.account.js';

// 사용자 생성
export const createUser = async (account, password) => {
  unlinkAccountByRedis(account);
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_USER, [account, password]);
  return { id: result.insertId };
};

// 아이디로 사용자 찾기
export const findUserByAccount = async (account) => {
  let result = await getAccountByRedis(account);
  if (result) {
    return result;
  }
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT, [account]);
  result = rows.length > 0 ? toCamelCase(rows[0]) : null;
  if (result != null) {
    await setAccountByRedis(result);
  }
  return result;
};

// 사용자 수정
export const updateUser = async (id, account, password) => {
  unlinkAccountByRedis(account);
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_USER, [account, password, id]);
  return { affectedRows: result.affectedRows };
};

// 사용자 삭제
export const deleteUser = async (account) => {
  unlinkAccountByRedis(account);
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_USER, [account]);
  return { affectedRows: result.affectedRows };
};
