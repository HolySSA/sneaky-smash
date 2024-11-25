import dbPool from '../database.js'; // 데이터베이스 연결
import BOSS_SQL_QUERIES from './boss.queries.js';
import toCamelCase from '../../utils/transformCase.js'; // toCamelCase import

export const createBoss = async (
  maxHp,
  atk,
  def,
  criticalProbability,
  criticalDamageRate,
  moveSpeed,
  attackSpeed,
) => {
  const [result] = await dbPool.query(BOSS_SQL_QUERIES.CREATE_BOSS, [
    maxHp,
    atk,
    def,
    criticalProbability,
    criticalDamageRate,
    moveSpeed,
    attackSpeed,
  ]);

  return { id: result.insertId };
};

export const findBossById = async (id) => {
  const [rows] = await dbPool.query(BOSS_SQL_QUERIES.FIND_BOSS_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

export const findAllBosses = async () => {
  const [rows] = await dbPool.query(BOSS_SQL_QUERIES.FIND_ALL_BOSSES);
  return rows.map(toCamelCase);
};

export const updateBoss = async (
  id,
  maxHp,
  atk,
  def,
  criticalProbability,
  criticalDamageRate,
  moveSpeed,
  attackSpeed,
) => {
  const [result] = await dbPool.query(BOSS_SQL_QUERIES.UPDATE_BOSS, [
    maxHp,
    atk,
    def,
    criticalProbability,
    criticalDamageRate,
    moveSpeed,
    attackSpeed,
    id,
  ]);

  return { affectedRows: result.affectedRows };
};

export const deleteBoss = async (id) => {
  const [result] = await dbPool.query(BOSS_SQL_QUERIES.DELETE_BOSS, [id]);
  return { affectedRows: result.affectedRows };
};
