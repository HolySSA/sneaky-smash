CREATE TABLE IF NOT EXISTS characters (
  id INT PRIMARY KEY AUTO_INCREMENT,       -- 캐릭터 고유 ID (기본키, 자동 증가)
  userId INT NOT NULL UNIQUE,              -- 사용자 ID (외래 키, 고유)
  nickname VARCHAR(100) NOT NULL,          -- 캐릭터 닉네임
  myClass INT NOT NULL,                    -- 캐릭터 클래스
  gold INT DEFAULT 0,                      -- 캐릭터 골드 (기본값 0)
  FOREIGN KEY (userId) REFERENCES user(id) -- 외래 키 설정 (user 테이블과 연결)
);
