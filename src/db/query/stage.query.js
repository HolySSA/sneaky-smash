
const SQL_QUERIES = {
    CREATE_STAGE: 'INSERT INTO stage (MonsterID, MonsterCount) VALUES (?, ?)',
    FIND_STAGE_BY_ID: 'SELECT * FROM stage WHERE id = ?',
    FIND_ALL_STAGES: 'SELECT * FROM stage',
    UPDATE_STAGE: 'UPDATE stage SET MonsterID = ?, MonsterCount = ? WHERE id = ?',
    DELETE_STAGE: 'DELETE FROM stage WHERE id = ?',
  };
  
  export default SQL_QUERIES;