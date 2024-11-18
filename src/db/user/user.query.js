export const SQL_QUERIES = {
    CREATE_USER: 'INSERT INTO User (account, password) VALUES (?, ?)',
    FIND_USER_BY_ACCOUNT: 'SELECT COUNT(*) AS count FROM User WHERE account = ?',
  };