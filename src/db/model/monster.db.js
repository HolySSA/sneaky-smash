import dbPool from '../database.js';
import SQL_QUERIES from '../query/monster.queries.js';
import toCamelCase from '../../utils/transformCase.js';

// 몬스터 생성
export const createMonster = async (
  maxHp,
  atk,
  def,
  criticalProbability,
  criticalDamageRate,
  moveSpeed,
  attackSpeed,
) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_MONSTER, [
    maxHp,
    atk,
    def,
    criticalProbability,
    criticalDamageRate,
    moveSpeed,
    attackSpeed,
  ]);
  return { insertId: result.insertId };
};

// 몬스터를 ID로 찾기
export const findMonsterById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_MONSTER_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 몬스터 조회
export const findAllMonsters = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_MONSTERS);
  return rows.map((row) => toCamelCase(row));
};

// 몬스터 수정
export const updateMonster = async (
  id,
  maxHp,
  atk,
  def,
  criticalProbability,
  criticalDamageRate,
  moveSpeed,
  attackSpeed,
) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_MONSTER, [
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

// 몬스터 삭제
export const deleteMonster = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_MONSTER, [id]);
  return { affectedRows: result.affectedRows };
};
