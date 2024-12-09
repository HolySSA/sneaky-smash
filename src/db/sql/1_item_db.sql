-- SQLBook: Code

CREATE TABLE IF NOT EXISTS item (
  id INT AUTO_INCREMENT PRIMARY KEY,        -- 아이템 고유 ID
  gold INT NOT NULL,                        -- 아이템 가격 또는 금액
  ATK INT DEFAULT 0,                        -- 아이템 공격력
  DEF INT DEFAULT 0,                        -- 아이템 방어력
  MaxHp INT DEFAULT 0,                      -- 아이템 최대 HP 증가
  CriticalDamageRate INT DEFAULT 0,         -- 아이템 치명타 데미지 배율
  CriticalProbability INT DEFAULT 0,        -- 아이템 치명타 확률
  curHp INT DEFAULT 0,                      -- 아이템 회복되는 현재 HP
  MoveSpeed INT DEFAULT 0                   -- 아이템 이동 속도 증가
);
