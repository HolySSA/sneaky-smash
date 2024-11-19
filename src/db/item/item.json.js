import fs from 'fs';
import path from 'path';

// JSON 파일 경로
const dataFilePath = path.resolve('../json/items.json');  // JSON 파일의 경로

// JSON 파일 읽기 함수
function readItemData() {
  const rawData = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(rawData);
}

// 아이템 추가
export function createItem(newItem) {
  const itemData = readItemData();
  itemData.data.push(newItem);  // 새로운 아이템 추가
  fs.writeFileSync(dataFilePath, JSON.stringify(itemData, null, 2), 'utf8');  // JSON 파일로 저장
}

// 아이템 조회 (아이템 ID로)
export function getItemById(id) {
  const itemData = readItemData();
  return itemData.data.find(item => item.itemID === id);  // 아이템 ID로 찾기
}

// 아이템 수정
export function updateItem(id, updatedInfo) {
  const itemData = readItemData();
  const itemIndex = itemData.data.findIndex(item => item.itemID === id);
  
  if (itemIndex !== -1) {
    // 아이템 정보를 수정하고 다시 저장
    itemData.data[itemIndex] = { ...itemData.data[itemIndex], ...updatedInfo };
    fs.writeFileSync(dataFilePath, JSON.stringify(itemData, null, 2), 'utf8');
  } else {
    console.log("Item not found!");
  }
}

// 아이템 삭제
export function deleteItem(id) {
  const itemData = readItemData();
  const itemIndex = itemData.data.findIndex(item => item.itemID === id);
  
  if (itemIndex !== -1) {
    // 아이템 삭제하고 다시 저장
    itemData.data.splice(itemIndex, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(itemData, null, 2), 'utf8');
  } else {
    console.log("Item not found!");
  }
}

// 모든 아이템 조회
export function getAllItems() {
  const itemData = readItemData();
  return itemData.data;  // 모든 아이템 반환
}
