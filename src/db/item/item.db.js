import dbPool from '../database.js';
import { SQL_QUERIES } from './user.query.js';

// 아이템 생성
export const createItem = async ({ gold, ATK, DEF, MaxHP, CriticalDamageRate, CriticalProbability, CurHP, MoveSpeed }) => {
    const [result] = await dbPool.query(SQL_QUERIES.CREATE_ITEM, [gold, ATK, DEF, MaxHP, CriticalDamageRate, CriticalProbability, CurHP, MoveSpeed]);
    return { id: result.insertId, gold, ATK, DEF, MaxHP, CriticalDamageRate, CriticalProbability, CurHP, MoveSpeed }
};

// 특정 아이템을 조회
