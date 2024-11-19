export const SQL_QUERIES = {
    CREATE_ITEM: 'INSERT INTO item (gold, ATK, DEF, MaxHP, CriticalDamageRate, CriticalProbability, CurHP, MoveSpeed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    GET_ITEM_BY_ID: 'SELECT * FROM item WHERE id = ?',
    UPDATE_ITEM: 'UPDATE item SET gold = ?, ATK = ?, DEF = ?, MaxHP = ?, CriticalDamageRate = ?, CriticalProbability = ?, CurHP = ?, MoveSpeed = ? WHERE id = ?',
    DELETE_ITEM: 'DELETE FROM item WHERE id ='
}