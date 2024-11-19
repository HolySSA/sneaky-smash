import fs from 'fs';
import path from 'path';

// JSON 파일 경로
const dataFilePath = path.resolve('../json/monsters.json');

// JSON 파일 읽기 함수
function readMonsterData() {
  const rawData = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(rawData);
}

// 몬스터 추가
export function createMonster(newMonster) {
  const monsterData = readMonsterData();
  monsterData.data.push(newMonster);
  fs.writeFileSync(dataFilePath, JSON.stringify(monsterData, null, 2), 'utf8');
}

// 몬스터 조회
export function getMonsterById(id) {
  const monsterData = readMonsterData();
  return monsterData.data.find(monster => monster.id === id);
}

// 몬스터 수정
export function updateMonster(id, updatedInfo) {
  const monsterData = readMonsterData();
  const monsterIndex = monsterData.data.findIndex(monster => monster.id === id);
  if (monsterIndex !== -1) {
    monsterData.data[monsterIndex] = { ...monsterData.data[monsterIndex], ...updatedInfo };
    fs.writeFileSync(dataFilePath, JSON.stringify(monsterData, null, 2), 'utf8');
  } else {
    console.log("Monster not found!");
  }
}

// 몬스터 삭제
export function deleteMonster(id) {
  const monsterData = readMonsterData();
  const monsterIndex = monsterData.data.findIndex(monster => monster.id === id);
  if (monsterIndex !== -1) {
    monsterData.data.splice(monsterIndex, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(monsterData, null, 2), 'utf8');
  } else {
    console.log("Monster not found!");
  }
}

// 모든 몬스터 조회
export function getAllMonsters() {
  const monsterData = readMonsterData();
  return monsterData.data;
}
