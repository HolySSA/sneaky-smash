import dbPool from '../database.js';
import SQL_QUERIES from './item.query.js';
import handleDbQuery from '../../utils/dbHelper.js';  // DB 처리 함수 임포트

// 아이템 생성 (INSERT)
export const createItem = async (item) => {
  const { gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, CurHp, MoveSpeed } = item;

  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.CREATE_ITEM,
    gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, CurHp, MoveSpeed
  ]);

  return { id: result.insertId, ...item };  // 생성된 아이템 반환
};

// 아이템 조회 (단일)
export const getItemById = async (id) => {
  const row = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.GET_ITEM_BY_ID, id]);
  
  if (!row) {
    throw new Error(`Item with ID ${id} not found.`);
  }

  return row;  // 단일 아이템 반환
};

// 모든 아이템 조회
export const getAllItems = async () => {
  const rows = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.GET_ALL_ITEMS], true);  // isArray = true
  return rows;  // 모든 아이템 반환
};

// 아이템 수정 (UPDATE)
export const updateItem = async (id, item) => {
  const { gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, CurHp, MoveSpeed } = item;

  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.UPDATE_ITEM, 
    gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, CurHp, MoveSpeed, id
  ]);

  if (result.affectedRows === 0) {
    throw new Error(`Item with ID ${id} not found or no changes made.`);
  }

  return { id, ...item };  // 수정된 아이템 반환
};

// 아이템 삭제 (DELETE)
export const deleteItem = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_ITEM, id]);

  if (result.affectedRows === 0) {
    throw new Error(`Item with ID ${id} not found.`);
  }

  return { id };  // 삭제된 아이템의 ID 반환
};
