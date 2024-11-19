import toCamelCase from '../../utils/transformCase.js';
import dbPool from '../database.js';
import { SQL_QUERIES } from './user.query.js';

// 캐릭터 생성하기
export const addCharacter = async ({ userId, nickname, class: className, gold }) => {
    const [result] = await dbPool.query(SQL_QUERIES.ADD_CHARACTER, [userId, nickname, className, gold]);
    return { id: result.insertId, userId, nickname, class: className, gold };
};

// 유저가 보유한 모든 캐릭터 불러오기
export const getCharactersByUserId = async (userId) => {
    const [rows] = await dbPool.query(SQL_QUERIES.GET_CHARACTERS_BY_USER_ID, [userId]);
    return toCamelCase(rows);
};

// 특정 캐릭터 정보를 업데이트
export const updateCharacter = async (id, updates) => {
    const { nickname, class: className, gold } = updates;
    await dbPool.query(SQL_QUERIES.UPDATE_CHARACTER, [nickname, className, gold, id]);
    return { id, ...updates };
};

// 캐릭터 삭제하기
export const deleteCharacter = async (id) => {
    await dbPool.query(SQL_QUERIES.DELETE_CHARACTER, [id]);
    return { id };
};