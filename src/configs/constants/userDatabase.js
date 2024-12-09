import configs from '../constants/env.js';

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = configs;

const userDatabases = {
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
};

export default userDatabases;
