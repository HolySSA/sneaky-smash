const SQL_QUERIES = {
  CREATE_EQUIPMENT: `INSERT INTO equipment (gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, curHp, MoveSpeed) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  GET_EQUIPMENT_BY_ID: `SELECT * FROM equipment WHERE id = ?`,
  GET_ALL_EQUIPMENTS: `SELECT * FROM equipment`,
  UPDATE_EQUIPMENT: `UPDATE equipment SET 
    gold = ?, ATK = ?, DEF = ?, MaxHp = ?, 
    CriticalDamageRate = ?, CriticalProbability = ?, 
    curHp = ?, MoveSpeed = ? WHERE id = ?`,
  DELETE_EQUIPMENT: `DELETE FROM equipment WHERE id = ?`,
};

export default SQL_QUERIES;
