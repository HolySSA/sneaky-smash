-- SQLBook: Code
CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,        -- 장비 고유 ID
  gold INT NOT NULL,                        -- 장비 가격 (금액)
  ATK INT DEFAULT 0,                        -- 장비 공격력
  DEF INT DEFAULT 0,                        -- 장비 방어력
  MaxHp INT DEFAULT 0,                      -- 장비 최대 HP 증가
  CriticalDamageRate INT DEFAULT 0,         -- 장비 치명타 데미지 배율
  CriticalProbability INT DEFAULT 0,        -- 장비 치명타 확률
  CurHp INT DEFAULT 0,                      -- 장비 회복되는 현재 HP
  MoveSpeed INT DEFAULT 0                   -- 장비 이동 속도 증가
);
