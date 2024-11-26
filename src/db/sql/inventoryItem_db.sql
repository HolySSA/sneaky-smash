CREATE TABLE IF NOT EXISTS inventoryItem (
  id INT AUTO_INCREMENT PRIMARY KEY,        -- 고유 ID
  itemId INT,                               -- 아이템 ID (items 테이블의 외래 키)
  characterId INT NOT NULL,                 -- 캐릭터 ID (characters 테이블의 외래 키)
  amount INT,                               -- 아이템/장비 수량

  FOREIGN KEY (itemId) REFERENCES item(id),  -- 아이템 외래 키
  FOREIGN KEY (characterId) REFERENCES characters(id) ON DELETE CASCADE  -- 캐릭터 외래 키
);
