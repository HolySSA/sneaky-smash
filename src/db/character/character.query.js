export const SQL_QUERIES = {
  ADD_CHARACTER: 'INSERT INTO characters (userId, nickname, myClass, gold) VALUES (?, ?, ?, ?)',
  GET_CHARACTER_BY_USER_ID: 'SELECT * FROM characters WHERE userId = ?',
  UPDATE_CHARACTER: 'UPDATE characters SET nickname = ?, myClass = ?, gold = ? WHERE id =?',
  DELETE_CHARACTER: 'DELETE FROM characters WHERE id = ?',
};
