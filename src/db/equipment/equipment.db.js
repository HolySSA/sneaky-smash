import dbPool from '../database.js';
import SQL_QUERIES from './equipment.query.js';
import handleDbQuery from '../../utils/dbHelper.js';

// 장비 생성 (INSERT)
export const createEquipment = async (equipment) => {
  const { gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, CurHp, MoveSpeed } =
    equipment;

  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.CREATE_EQUIPMENT,
    gold,
    ATK,
    DEF,
    MaxHp,
    CriticalDamageRate,
    CriticalProbability,
    CurHp,
    MoveSpeed,
  ]);

  return { id: result.insertId, ...equipment }; // 생성된 장비 반환
};

// 장비 조회 (단일)
export const findEquipmentById = async (id) => {
  const row = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.FIND_EQUIPMENT_BY_ID,
    id,
  ]);
  if (!row) {
    throw new Error(`Equipment with ID ${id} not found.`);
  }
  return row; // 단일 장비 반환
};

// 모든 장비 조회
export const findAllEquipments = async () => {
  const rows = await handleDbQuery(
    dbPool.query.bind(dbPool),
    [SQL_QUERIES.FIND_ALL_EQUIPMENTS],
    true,
  ); // isArray = true
  return rows; // 모든 장비 반환
};

// 장비 수정 (UPDATE)
export const updateEquipment = async (id, equipment) => {
  const { gold, ATK, DEF, MaxHp, CriticalDamageRate, CriticalProbability, CurHp, MoveSpeed } =
    equipment;

  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.UPDATE_EQUIPMENT,
    gold,
    ATK,
    DEF,
    MaxHp,
    CriticalDamageRate,
    CriticalProbability,
    CurHp,
    MoveSpeed,
    id,
  ]);

  if (result.affectedRows === 0) {
    throw new Error(`Equipment with ID ${id} not found or no changes made.`);
  }

  return { id, ...equipment }; // 수정된 장비 반환
};

// 장비 삭제 (DELETE)
export const deleteEquipment = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_EQUIPMENT, id]);

  if (result.affectedRows === 0) {
    throw new Error(`Equipment with ID ${id} not found.`);
  }

  return { id }; // 삭제된 장비의 ID 반환
};
