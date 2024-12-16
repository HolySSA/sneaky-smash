import dbPool from '../database.js';
import SQL_QUERIES from '../query/item.queries.js';
import toCamelCase from '../../utils/transformCase.js';

// 아이템 생성 (INSERT)
export const createItem = async (
  gold,
  atk = 0,
  def = 0,
  maxHp = 0,
  criticalDamageRate = 0,
  criticalProbability = 0,
  curHp = 0,
  moveSpeed = 0,
) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_ITEM, [
    gold,
    atk,
    def,
    maxHp,
    criticalDamageRate,
    criticalProbability,
    curHp,
    moveSpeed,
  ]);
  return { insertId: result.insertId };
};

// 아이템 조회 (단일)
export const findItemById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ITEM_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 아이템 조회
export const findAllItems = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_ITEMS);
  return rows.map((row) => toCamelCase(row));
};

// 아이템 수정 (UPDATE)
export const updateItem = async (
  id,
  gold,
  atk = 0,
  def = 0,
  maxHp = 0,
  criticalDamageRate = 0,
  criticalProbability = 0,
  curHp = 0,
  moveSpeed = 0,
) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_ITEM, [
    gold,
    atk,
    def,
    maxHp,
    criticalDamageRate,
    criticalProbability,
    curHp,
    moveSpeed,
    id,
  ]);
  return { affectedRows: result.affectedRows };
};

// 아이템 삭제 (DELETE)
export const deleteItem = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_ITEM, [id]);
  return { affectedRows: result.affectedRows };
};
