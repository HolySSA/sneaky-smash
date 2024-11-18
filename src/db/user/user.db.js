import dbPool from "../database.js";

export const findUserByAccount = async () => {
    const [rows] = await dbPool.USER.DB.query(SQL_QUERIES.FIND_USER_BY_ACCOUNT, [account]);
    return rows[0].count > 0; // 찾는 아이디가 존재하면 true, 없으면 false
}

export const createUser = async (account, password) => {
    await dbPool.USER_DB.query(SQL_QUERIES.CREATE_USER, [account, password]);
  
    return { account, password };
};