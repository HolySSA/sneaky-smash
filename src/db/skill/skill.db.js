// skill.db.js
import dbPool from '../database.js';
import SQL_QUERIES from './skill.query.js';
import handleDbQuery from '../../utils/dbHelper.js';  // DB 처리 함수 임포트

// 스킬 생성
export const createSkill = async (DamageRate, CoolTime, IncreasePercent, DecreasePercent) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.CREATE_SKILL, DamageRate, CoolTime, IncreasePercent, DecreasePercent
  ]);
  return { id: result.insertId, DamageRate, CoolTime, IncreasePercent, DecreasePercent };  // 생성된 스킬 반환
};

// 스킬 조회
export const findSkillById = async (id) => {
  const rows = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_SKILL_BY_ID, id]);
  if (rows.length === 0) {
    throw new Error(`Skill with ID ${id} not found.`);
  }
  return rows[0];
};

// 모든 스킬 조회
export const findAllSkills = async () => {
  const rows = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_ALL_SKILLS]);
  return rows;  // 모든 스킬 반환
};

// 스킬 수정
export const updateSkill = async (id, DamageRate, CoolTime, IncreasePercent, DecreasePercent) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [
    SQL_QUERIES.UPDATE_SKILL, DamageRate, CoolTime, IncreasePercent, DecreasePercent, id
  ]);
  if (result.affectedRows === 0) {
    throw new Error(`Skill with ID ${id} not found or no changes made.`);
  }
  return { id, DamageRate, CoolTime, IncreasePercent, DecreasePercent };  // 수정된 스킬 반환
};

// 스킬 삭제
export const deleteSkill = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_SKILL, id]);
  if (result.affectedRows === 0) {
    throw new Error(`Skill with ID ${id} not found.`);
  }
  return { id };  // 삭제된 스킬의 ID 반환
};
