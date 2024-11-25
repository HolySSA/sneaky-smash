const SQL_QUERIES = {
  // 보스 생성
  CREATE_BOSS:
    'INSERT INTO boss (MaxHp, ATK, DEF, CriticalProbability, CriticalDamageRate, MoveSpeed, attackSpeed) VALUES (?, ?, ?, ?, ?, ?, ?)',

  // 보스 조회
  FIND_BOSS_BY_ID: 'SELECT * FROM boss WHERE id = ?',

  // 모든 보스 조회
  FIND_ALL_BOSSES: 'SELECT * FROM boss',

  // 보스 수정
  UPDATE_BOSS:
    'UPDATE boss SET MaxHp = ?, ATK = ?, DEF = ?, CriticalProbability = ?, CriticalDamageRate = ?, MoveSpeed = ?, attackSpeed = ? WHERE id = ?',

  // 보스 삭제
  DELETE_BOSS: 'DELETE FROM boss WHERE id = ?',
};

export default SQL_QUERIES;
