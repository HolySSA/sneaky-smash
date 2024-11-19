export const SQL_QUERIES = {
    CREATE_MONSTER: // 몬스터 테이블 만들기
    ` INSERT INTO monsters (MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, AttackSpeed) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    
    FIND_MONSTER_BY_ID: // Id에 맞는 몬스터 찾기
    `SELECT * FROM monsters WHERE id = ?`,

    GET_ALL_MONSTERS: // 몬스터 전체 조회?
    `SELECT * FROM monsters`,

    UPDATE_MONSTER: // Id에 맞는 몬스터 테이블 값 변경
    `UPDATE monsters
    SET MaxHp = ?, ATK = ?, DEF = ?, CriticalProbability = ?, CriticalDamageRate = ?, MoveSpeed = ?, AttackSpeed = ?
    WHERE id = ?`,

    DELETE_MONSTER: // Id에 맞는 몬스터 테이블 값 삭제
    `DELETE FROM monsters WHERE id = ?`
}