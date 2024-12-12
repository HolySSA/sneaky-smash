const SQL_QUERIES = {
  CREATE_USER: `
    INSERT INTO user (account, password)
    VALUES (?, ?)
  `,
  FIND_USER_BY_ACCOUNT: `
    SELECT * FROM user WHERE account = ?
  `,
  FIND_ALL_USERS: `
    SELECT * FROM user
  `,
  UPDATE_USER: `
    UPDATE user
    SET account = ?, password = ?
    WHERE id = ?
  `,
  DELETE_USER: `
    DELETE FROM user WHERE account = ?
  `,
};

export default SQL_QUERIES;
