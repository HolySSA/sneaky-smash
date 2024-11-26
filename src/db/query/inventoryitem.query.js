const SQL_QUERIES = {
  CREATE_INVENTORY_ITEM: `
      INSERT INTO inventoryItem (itemId, characterId, amount)
      VALUES (?, ?, ?)
    `,
  FIND_INVENTORY_ITEM_BY_ID: `
      SELECT * FROM inventoryItem WHERE id = ?
    `,
  FIND_INVENTORY_ITEMS_BY_CHARACTER_ID: `
      SELECT * FROM inventoryItem WHERE characterId = ?
    `,
  UPDATE_INVENTORY_ITEM: `
      UPDATE inventoryItem 
      SET itemId = ?, characterId = ?, amount = ?
      WHERE id = ?
    `,
  DELETE_INVENTORY_ITEM: `
      DELETE FROM inventoryItem WHERE id = ?
    `,
  DELETE_INVENTORY_ITEMS_BY_CHARACTER_ID: `
      DELETE FROM inventoryItem WHERE characterId = ?
    `,
};

export default SQL_QUERIES;
