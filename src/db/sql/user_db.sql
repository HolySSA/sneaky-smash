-- SQLBook: Code
CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,       -- 사용자 고유 ID (기본키, 자동 증가)
    account VARCHAR(50) NOT NULL UNIQUE,     -- 계정명 (중복 불가)
    password VARCHAR(255) NOT NULL           -- 비밀번호 (암호화된 값 저장)
);
