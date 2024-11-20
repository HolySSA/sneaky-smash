-- SQLBook: Code
CREATE TABLE IF NOT EXISTS skill (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- 스킬 고유 ID (자동 증가)
    DamageRate INT NOT NULL,                     -- 데미지 배율
    CoolTime FLOAT NOT NULL,                     -- 쿨타임
    IncreasePercent INT NOT NULL,                -- 증가 비율
    DecreasePercent INT NOT NULL                 -- 감소 비율
);