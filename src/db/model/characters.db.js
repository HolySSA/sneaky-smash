import dbPool from '../database.js';
import SQL_QUERIES from '../query/characters.query.js';
import toCamelCase from '../../utils/transformCase.js';
import {
  getRedisUserById,
  removeRedisUser,
  setRedisUser,
} from '../../sessions/redis/redis.user.js';

// 캐릭터 생성
export const createCharacter = async (userId, nickname, myClass, gold = 0) => {
  removeRedisUser(userId);
  const [result] = await dbPool.query(SQL_QUERIES.CREATE_CHARACTER, [
    userId,
    nickname,
    myClass,
    gold,
  ]);
  return { id: result.insertId };
};

// 사용자 ID로 캐릭터 찾기
export const findCharacterByUserId = async (userId) => {
  let result = await getRedisUserById(userId);
  if (result != null) {
    return result;
  }

  const [rows] = await dbPool.query(SQL_QUERIES.FIND_CHARACTER_BY_USERID, [userId]);
  result = rows.length > 0 ? toCamelCase(rows[0]) : null;
  if (result != null) {
    setRedisUser(result);
  }
  return result;
};
// 캐릭터 수정
export const updateCharacter = async (userId, nickname, myClass, gold) => {
  removeRedisUser(userId);
  const [result] = await dbPool.query(SQL_QUERIES.UPDATE_CHARACTER, [
    nickname,
    myClass,
    gold,
    userId,
  ]);

  return { affectedRows: result.affectedRows };
};

// 캐릭터 삭제
export const deleteCharacter = async (userId) => {
  removeRedisUser(userId);
  const [result] = await dbPool.query(SQL_QUERIES.DELETE_CHARACTER, [userId]);
  return { affectedRows: result.affectedRows };
};
