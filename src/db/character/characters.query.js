// export const SQL_QUERIES = {
//   ADD_CHARACTER: 'INSERT INTO characters (userId, nickname, myClass, gold) VALUES (?, ?, ?, ?)',
//   FIND_CHARACTER_BY_USER_ID: 'SELECT * FROM characters WHERE userId = ?',
//   UPDATE_CHARACTER: 'UPDATE characters SET nickname = ?, myClass = ?, gold = ? WHERE id =?',
//   DELETE_CHARACTER: 'DELETE FROM characters WHERE id = ?',
// };

// character.query.js

const SQL_QUERIES = {
  CREATE_CHARACTER: `
    INSERT INTO characters (userId, nickname, class, gold)
    VALUES (?, ?, ?, ?)
  `,
  FIND_CHARACTER_BY_USERID: `
    SELECT * FROM characters WHERE userId = ?
  `,
  FIND_ALL_CHARACTERS: `
    SELECT * FROM characters
  `,
  UPDATE_CHARACTER: `
    UPDATE characters
    SET nickname = ?, class = ?, gold = ?
    WHERE userId = ?
  `,
  DELETE_CHARACTER: `
    DELETE FROM characters WHERE userId = ?
  `,
};

export default SQL_QUERIES;
