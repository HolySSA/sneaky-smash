CREATE TABLE IF NOT EXISTS monsters (
  id INT AUTO_INCREMENT PRIMARY KEY,              -- 몬스터 고유 ID
  MaxHp INT NOT NULL,                             -- 최대 HP
  ATK INT NOT NULL,                               -- 공격력
  DEF INT NOT NULL,                               -- 방어력
  CriticalProbability INT NOT NULL,               -- 치명타 확률
  CriticalDamageRate INT NOT NULL,                -- 치명타 피해율
  MoveSpeed INT NOT NULL,                         -- 이동 속도
  AttackSpeed INT NOT NULL,                       -- 공격 속도
);

