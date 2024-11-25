import dbPool from '../database.js';
import SQL_QUERIES from './boss.query.js';
import handleDbQuery from '../../utils/db/dbHelper.js';  // DB 처리 함수 임포트

// 보스 생성 함수 (INSERT)
export const createBoss = async (MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.CREATE_BOSS, 
    MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed
  ]);
  return { id: result.insertId, MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed };  // 생성된 보스 반환
};

// 특정 보스 조회 함수 (SELECT)
export const findBossById = async (id) => {
  const rows = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_BOSS_BY_ID, id]);
  if (!rows) {
    throw new Error(`Boss with ID ${id} not found.`);
  }
  return rows;  // 단일 보스 반환
};

// 모든 보스 조회 함수 (SELECT)
export const findAllBosses = async () => {
  const rows = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_ALL_BOSSES], true);  // isArray = true
  return rows;  // 모든 보스 반환
};

// 보스 수정 함수 (UPDATE)
export const updateBoss = async (id, MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.UPDATE_BOSS, 
    MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed, id
  ]);
  if (result.affectedRows === 0) {
    throw new Error(`Boss with ID ${id} not found or no changes made.`);
  }
  return { id, MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed };  // 수정된 보스 반환
};

// 보스 삭제 함수 (DELETE)
export const deleteBoss = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_BOSS, id]);
  if (result.affectedRows === 0) {
    throw new Error(`Boss with ID ${id} not found.`);
  }
  return { id };  // 삭제된 보스의 ID 반환
};
