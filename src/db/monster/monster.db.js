import dbPool from '../database.js';
import SQL_QUERIES from './monster.query.js';
import handleDbQuery from '../../utils/db/dbHelper.js'; // DB 처리 함수 임포트

// 몬스터를 ID로 찾기
export const findMonsterById = async (id) => {
  const row = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.FIND_MONSTER_BY_ID, id]);
  if (!row) {  // row가 없으면 오류
    throw new Error(`Monster with ID ${id} not found.`);
  }
  return row; // 이미 카멜케이스로 변환된 결과 반환
};

// 몬스터 생성
export const createMonster = async (monster) => {
  const { maxHp, atk, def, criticalProbability, criticalDamageRate, moveSpeed, attackSpeed } = monster;
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.CREATE_MONSTER, 
    maxHp, atk, def, criticalProbability, criticalDamageRate, moveSpeed, attackSpeed
  ]);
  return { id: result.insertId, ...monster }; // 생성된 몬스터 ID를 포함하여 반환
};

// 모든 몬스터 조회
export const getAllMonsters = async () => {
  const rows = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.GET_ALL_MONSTERS], true); // 여러 결과 반환
  return rows; // 이미 카멜케이스로 변환된 결과 반환
};

// 몬스터 수정
export const updateMonster = async (id, updatedData) => {
  const { maxHp, atk, def, criticalProbability, criticalDamageRate, moveSpeed, attackSpeed } = updatedData;
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.UPDATE_MONSTER, 
    maxHp, atk, def, criticalProbability, criticalDamageRate, moveSpeed, attackSpeed, id
  ]);
  if (result.affectedRows === 0) {
    throw new Error(`Monster with ID ${id} not found or no changes made.`);
  }
  return { id, ...updatedData }; // 수정된 데이터 반환
};

// 몬스터 삭제
export const deleteMonster = async (id) => {
  const result = await handleDbQuery(dbPool.query.bind(dbPool), [SQL_QUERIES.DELETE_MONSTER, id]);
  if (result.affectedRows === 0) {
    throw new Error(`Monster with ID ${id} not found.`);
  }
  return { id }; // 삭제된 몬스터의 ID 반환
};
