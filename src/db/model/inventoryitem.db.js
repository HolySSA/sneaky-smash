import dbPool from '../database.js';
import SQL_QUERIES from '../query/inventoryItem.query.js';
import toCamelCase from '../../utils/transformCase.js';

// 인벤토리 아이템 생성
export const createInventoryItem = async (itemId, characterId, amount) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_INVENTORY_ITEM, [
    itemId,
    characterId,
    amount,
  ]);
  return { id: result.insertId };
};

// 아이디로 인벤토리 아이템 찾기
export const findInventoryItemById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_INVENTORY_ITEM_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 특정 캐릭터의 모든 인벤토리 아이템 조회
export const findInventoryItemsByCharacterId = async (characterId) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_INVENTORY_ITEMS_BY_CHARACTER_ID, [
    characterId,
  ]);
  return rows.map(toCamelCase);
};

// 인벤토리 아이템 수정
export const updateInventoryItem = async (id, itemId, characterId, amount) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_INVENTORY_ITEM, [
    itemId,
    characterId,
    amount,
    id,
  ]);
  return { affectedRows: result.affectedRows };
};

// 인벤토리 아이템 삭제
export const deleteInventoryItem = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_INVENTORY_ITEM, [id]);
  return { affectedRows: result.affectedRows };
};

// 특정 캐릭터의 모든 아이템 삭제 (캐릭터 삭제 시 CASCADE 처리됨)
export const deleteInventoryItemsByCharacterId = async (characterId) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_INVENTORY_ITEMS_BY_CHARACTER_ID, [
    characterId,
  ]);
  return { affectedRows: result.affectedRows };
};
