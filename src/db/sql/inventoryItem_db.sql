CREATE TABLE IF NOT EXISTS inventoryItem (
  id INT PRIMARY KEY AUTO_INCREMENT,          -- 고유 ID (기본키, 자동 증가)
  itemId INT NOT NULL,                        -- 아이템 ID (아이템 테이블의 외래 키로 연결 가능)
  characterId INT NOT NULL,                   -- 캐릭터 ID (characters 테이블의 외래 키)
  amount INT DEFAULT 1,                       -- 아이템 수량 (기본값 1)
  FOREIGN KEY (characterId) REFERENCES characters(id) ON DELETE CASCADE  -- characters 테이블과의 외래 키 관계 (삭제 시 캐릭터의 아이템도 삭제)
 
);
