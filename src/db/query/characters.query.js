const SQL_QUERIES = {
  CREATE_CHARACTER: `
    INSERT INTO characters (userId, nickname, myClass, gold)
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
    SET nickname = ?, myClass = ?, gold = ?
    WHERE userId = ?
  `,
  DELETE_CHARACTER: `
    DELETE FROM characters WHERE userId = ?
  `,
};

export default SQL_QUERIES;
