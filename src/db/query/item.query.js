const SQL_QUERIES = {
  CREATE_ITEM: `INSERT INTO item (gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, curHp, MoveSpeed) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  GET_ITEM_BY_ID: `SELECT * FROM item WHERE id = ?`,
  GET_ALL_ITEMS: `SELECT * FROM item`,
  UPDATE_ITEM: `UPDATE item SET 
    gold = ?, ATK = ?, DEF = ?, MaxHp = ?, 
    CriticalDamageRate = ?, CriticalProbability = ?, curHp = ?, 
    MoveSpeed = ? WHERE id = ?`,
  DELETE_ITEM: `DELETE FROM item WHERE id = ?`,
};

export default SQL_QUERIES;
