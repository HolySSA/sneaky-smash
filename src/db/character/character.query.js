export const SQL_QUERIES = {
    ADD_CHARACTER: 'INSER INTO characters (userId, nickname, class, gold) VALUES (?, ?, ?, ?)',
    GET_CHARACTERS_BY_USER_ID: 'SELECT * FROM characters WHERE userId = ?',
    UPDATE_CHARACTER: 'UPDATE characters SET nickname = ?, class = ?, gold = ? WHERE id =?',
    DELETE_CHARACTER: 'DELETE FROM characters WHERE id = ?'
};