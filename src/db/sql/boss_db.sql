CREATE TABLE IF NOT EXISTS boss (
  id INT AUTO_INCREMENT PRIMARY KEY,          -- 고유 ID (자동 증가)
  MaxHp INT NOT NULL,                         -- 최대 HP
  ATK INT NOT NULL,                           -- 공격력
  DEF INT NOT NULL,                           -- 방어력
  CriticalProbability INT NOT NULL,           -- 치명타 확률
  CriticalDamageRate INT NOT NULL,            -- 치명타 데미지 배율 
  MoveSpeed INT NOT NULL,                     -- 이동 속도
  attackSpeed INT NOT NULL                    -- 공격 속도
);
