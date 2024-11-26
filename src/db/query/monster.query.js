const SQL_QUERIES = {
  CREATE_MONSTER: ` INSERT INTO monsters (MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, AttackSpeed) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
  FIND_MONSTER_BY_ID: `SELECT * FROM monsters WHERE id = ?`,
  GET_ALL_MONSTERS: `SELECT * FROM monsters`,
  UPDATE_MONSTER: `UPDATE monsters
    SET MaxHp = ?, ATK = ?, DEF = ?, CriticalProbability = ?, CriticalDamageRate = ?, MoveSpeed = ?, AttackSpeed = ?
    WHERE id = ?`,
  DELETE_MONSTER: `DELETE FROM monsters WHERE id = ?`,
};

export default SQL_QUERIES;
