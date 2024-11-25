import dbPool from '../database.js';
import SQL_QUERIES from '../query/skill.queries.js';
import toCamelCase from '../../utils/transformCase.js';

// 스킬 생성
export const createSkill = async (damageRate, coolTime, increasePercent, decreasePercent) => {
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_SKILL, [
    damageRate,
    coolTime,
    increasePercent,
    decreasePercent,
  ]);
  return { insertId: result.insertId };
};

// 스킬 조회
export const findSkillById = async (id) => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_SKILL_BY_ID, [id]);
  return rows.length > 0 ? toCamelCase(rows[0]) : null;
};

// 모든 스킬 조회
export const findAllSkills = async () => {
  const [rows] = await dbPool.query(SQL_QUERIES.FIND_ALL_SKILLS);
  return rows.map((row) => toCamelCase(row));
};

// 스킬 수정
export const updateSkill = async (id, damageRate, coolTime, increasePercent, decreasePercent) => {
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_SKILL, [
    damageRate,
    coolTime,
    increasePercent,
    decreasePercent,
    id,
  ]);
  return { affectedRows: result.affectedRows };
};

// 스킬 삭제
export const deleteSkill = async (id) => {
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_SKILL, [id]);
  return { affectedRows: result.affectedRows };
};
