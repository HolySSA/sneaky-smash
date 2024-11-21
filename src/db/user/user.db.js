import toCamelCase from '../../utils/transformCase.js';
import dbPool from '../database.js';
import { SQL_QUERIES } from './user.query.js';

export const findUserByAccount = async (account) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT, [account]);
  return toCamelCase(rows[0]);
};

export const createUser = async (account, password) => {
  await dbPool.query(SQL_QUERIES.CREATE_USER, [account, password]);

  return { account, password };
};
