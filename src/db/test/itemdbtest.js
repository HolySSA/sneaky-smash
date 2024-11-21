import { createItem, findItemById, findAllItems, updateItem, deleteItem } from '../item/item.db.js'; // 아이템 관련 DB 함수들 임포트

// 아이템 생성 테스트
const testCreateItem = async () => {
  try {
    const newItem = {
      gold: 200,
      ATK: 50,
      DEF: 30,
      MaxHp: 500,
      CriticalDamageRate: 2.0,
      CriticalProbability: 0.2,
      CurHp: 500,
      MoveSpeed: 1.5,
    };

    const createdItem = await createItem(newItem);
    console.log('Created Item:', createdItem); // 생성된 아이템 정보 출력

    return createdItem.id; // 생성된 아이템의 ID 반환
  } catch (error) {
    console.error('Error creating item:', error.message);
  }
};

// 아이템 ID로 조회 테스트
const testFindItemById = async (id) => {
  try {
    const item = await findItemById(id);
    console.log('Found Item:', item); // 조회된 아이템 정보 출력
  } catch (error) {
    console.error('Error finding item by ID:', error.message);
  }
};

// 모든 아이템 조회 테스트
const testFindAllItems = async () => {
  try {
    const items = await findAllItems();
    console.log('All Items:', items); // 모든 아이템 출력
  } catch (error) {
    console.error('Error finding all items:', error.message);
  }
};

// 아이템 수정 테스트
const testUpdateItem = async (id) => {
  try {
    const updatedData = {
      gold: 300,
      ATK: 60,
      DEF: 40,
      MaxHp: 600,
      CriticalDamageRate: 2.2,
      CriticalProbability: 0.25,
      CurHp: 600,
      MoveSpeed: 1.7,
    };

    const updatedItem = await updateItem(id, updatedData);
    console.log('Updated Item:', updatedItem); // 수정된 아이템 정보 출력
  } catch (error) {
    console.error('Error updating item:', error.message);
  }
};

// 아이템 삭제 테스트
const testDeleteItem = async (id) => {
  try {
    const deletedItem = await deleteItem(id);
    console.log('Deleted Item:', deletedItem); // 삭제된 아이템 정보 출력
  } catch (error) {
    console.error('Error deleting item:', error.message);
  }
};

// 실행 테스트
const runItemTests = async () => {
  console.log('Running item tests...');

  // 아이템 생성 후, 생성된 아이템의 ID를 이용하여 나머지 테스트 실행
  const createdItemId = await testCreateItem(); // 아이템 생성 후 ID 저장
  if (createdItemId) {
    await testFindItemById(createdItemId); // 생성된 아이템 ID로 조회
    await testFindAllItems(); // 모든 아이템 조회
    await testUpdateItem(createdItemId); // 생성된 아이템 ID로 수정
    await testDeleteItem(createdItemId); // 생성된 아이템 ID로 삭제
  }
};

runItemTests();
