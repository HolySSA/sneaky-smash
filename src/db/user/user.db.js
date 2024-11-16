import dbPool from "../database.js";

export const createUser = async (account, password) => {
    await dbPool.USER_DB.query(SQL_QUERIES.CREATE_USER, [account, password]);
  
    return { account, password };
};