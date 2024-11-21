const SQL_QUERIES = {
  // 몬스터 테이블 만들기
  CREATE_MONSTER: ` INSERT INTO monsters (MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, AttackSpeed) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,

  // Id에 맞는 몬스터 찾기
  FIND_MONSTER_BY_ID: `SELECT * FROM monsters WHERE id = ?`,

  // 몬스터 전체 조회?
  FIND_ALL_MONSTERS: `SELECT * FROM monsters`,

  // Id에 맞는 몬스터 테이블 값 변경
  UPDATE_MONSTER: `UPDATE monsters
    SET MaxHp = ?, ATK = ?, DEF = ?, CriticalProbability = ?, CriticalDamageRate = ?, MoveSpeed = ?, AttackSpeed = ?
    WHERE id = ?`,

  // Id에 맞는 몬스터 테이블 값 삭제
  DELETE_MONSTER: `DELETE FROM monsters WHERE id = ?`,
};

export default SQL_QUERIES;
