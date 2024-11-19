import dbPool from '../database.js';
import { SQL_QUERIES } from './inventoryitem.query.js';

// 아이템 사용
export const userItem = async ({ characterId, itemId, amount }) => {
    // 아이템이 충분한지 확인
    const [result] = await dbPool.query(SQL_QUERIES.USE_ITEM, [amount, characterId, itemId, amount]);

    if (result.affectedRows === 0) {
        throw new Error('아이템이 충분하지 않거나 아이템을 찾을 수 없습니다.');
    }

    return { characterId, itemId, usedAmount: amount };
};

// 장비 아이템 장착
export const equipItem = async ({ characterId, itemId }) => {
    // 장비 아이템이 존재하는지 확인
    const [item] = await dbPool.query(SQL_QUERIES.CHECK_ITEM, [characterId, itemId]);
    if (!item || item.amount === 0) {
        throw new Error('아이템이 존재하지 않거나 충분하지 않습니다.');
    }

    // 이후에 장비 아이템을 장착함
    await dbPool.query(SQL_QUERIES.EQUIP_ITEM, [characterId, itemId]);
    return { characterId, itemId, isEquipped: true };
};

// 아이템 버리기
export const discardItem = async ({ characterId, itemId, amount }) => {
    // 아이템이 충분한지 확인
    const [item] = await dbPool.query(SQL_QUERIES.CHECK_ITEM, [characterId, itemId]);
    if (!item || item.amount < amount) {
        throw new Error('아이템이 충분하지 않거나 아이템을 찾을 수 없습니다.');
    }

    // 아이템 버리기 (수량이 차감됨)
    await dbPool.query(SQL_QUERIES.DISCARD_ITEM, [amount, characterId, itemId, amount]);
    return { characterId, itemId, discardAmount: amount};
};