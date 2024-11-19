import fs from 'fs';
import path from 'path';

// JSON 파일 경로
const dataFilePath = path.resolve('../json/equipment.json');

// JSON 파일 읽기 함수
function readEquipmentData() {
  const rawData = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(rawData);
}

// 장비 추가
export function createEquipment(newEquipment) {
  const equipmentData = readEquipmentData();
  equipmentData.data.push(newEquipment);
  fs.writeFileSync(dataFilePath, JSON.stringify(equipmentData, null, 2), 'utf8');
}

// 장비 조회
export function getEquipmentById(id) {
  const equipmentData = readEquipmentData();
  return equipmentData.data.find(equipment => equipment.id === id);
}

// 모든 장비 조회
export function getAllEquipment() {
  const equipmentData = readEquipmentData();
  return equipmentData.data;
}

// 장비 수정
export function updateEquipment(id, updatedInfo) {
  const equipmentData = readEquipmentData();
  const equipmentIndex = equipmentData.data.findIndex(equipment => equipment.id === id);
  if (equipmentIndex !== -1) {
    equipmentData.data[equipmentIndex] = { ...equipmentData.data[equipmentIndex], ...updatedInfo };
    fs.writeFileSync(dataFilePath, JSON.stringify(equipmentData, null, 2), 'utf8');
  } else {
    console.log("Equipment not found!");
  }
}

// 장비 삭제
export function deleteEquipment(id) {
  const equipmentData = readEquipmentData();
  const equipmentIndex = equipmentData.data.findIndex(equipment => equipment.id === id);
  if (equipmentIndex !== -1) {
    equipmentData.data.splice(equipmentIndex, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(equipmentData, null, 2), 'utf8');
  } else {
    console.log("Equipment not found!");
  }
}
