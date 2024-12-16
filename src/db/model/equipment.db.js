import dbPool from '../database.js';
import SQL_QUERIES from '../query/equipment.queries.js';
import toCamelCase from '../../utils/transformCase.js';

// 장비 생성 (INSERT)
export const createEquipment = async (
  gold,
  atk = 0,
  def = 0,
  maxHp = 0,
  criticalDamageRate = 0,
  criticalProbability = 0,
  curHp = 0,
  moveSpeed = 0,
) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_EQUIPMENT, [
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

// 장비 조회 (단일)
export const findEquipmentById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_EQUIPMENT_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 장비 조회
export const findAllEquipments = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_EQUIPMENTS);
  return rows.map((row) => toCamelCase(row));
};

// 장비 수정 (UPDATE)
export const updateEquipment = async (
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
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_EQUIPMENT, [
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

// 장비 삭제 (DELETE)
export const deleteEquipment = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_EQUIPMENT, [id]);
  return { affectedRows: result.affectedRows };
};
