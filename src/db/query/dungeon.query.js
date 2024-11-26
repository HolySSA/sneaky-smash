const SQL_QUERIES = {
  CREATE_DUNGEON: 'INSERT INTO dungeon (stageList) VALUES (?)',
  FIND_DUNGEON_BY_ID: 'SELECT * FROM dungeon WHERE id = ?',
  FIND_ALL_DUNGEONS: 'SELECT * FROM dungeon',
  UPDATE_DUNGEON: 'UPDATE dungeon SET stageList = ? WHERE id = ?',
  DELETE_DUNGEON: 'DELETE FROM dungeon WHERE id = ?',
};

export default SQL_QUERIES;
