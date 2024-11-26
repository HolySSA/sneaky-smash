const SQL_QUERIES = {
  CREATE_BOSS:
    'INSERT INTO boss (MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed) VALUES (?, ?, ?, ?, ?, ?, ?)',
  FIND_BOSS_BY_ID: 'SELECT * FROM boss WHERE id = ?',
  FIND_ALL_BOSSES: 'SELECT * FROM boss',
  UPDATE_BOSS:
    'UPDATE boss SET MaxHp = ?, ATK = ?, DEF = ?, CriticalProbability = ?, CriticalDamageRate = ?, MoveSpeed = ?, attackSpeed = ? WHERE id = ?',
  DELETE_BOSS: 'DELETE FROM boss WHERE id = ?',
};

export default SQL_QUERIES;
