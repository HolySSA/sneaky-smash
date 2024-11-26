const SQL_QUERIES = {
    CREATE_SKILL: 'INSERT INTO skill (DamageRate, CoolTime, IncreasePercent, DecreasePercent) VALUES (?, ?, ?, ?)',
    FIND_SKILL_BY_ID: 'SELECT * FROM skill WHERE id = ?',
    FIND_ALL_SKILLS: 'SELECT * FROM skill',
    UPDATE_SKILL: 'UPDATE skill SET DamageRate = ?, CoolTime = ?, IncreasePercent = ?, DecreasePercent = ? WHERE id = ?',
    DELETE_SKILL: 'DELETE FROM skill WHERE id = ?',
  };
  export default SQL_QUERIES;