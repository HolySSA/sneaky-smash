import {
  createMonster,
  findMonsterById,
  findAllMonsters,
  updateMonster,
  deleteMonster,
} from '../monster/monster.db.js'; // 몬스터 관련 DB 함수들 임포트

// 몬스터 생성 테스트
const testCreateMonster = async () => {
  try {
    const newMonster = {
      maxHp: 1000,
      atk: 150,
      def: 80,
      criticalProbability: 0.25,
      criticalDamageRate: 1.5,
      moveSpeed: 5,
      attackSpeed: 1.2,
    };

    const createdMonster = await createMonster(newMonster);
    console.log('Created Monster:', createdMonster); // 생성된 몬스터 정보 출력

    return createdMonster.id; // 생성된 몬스터의 ID 반환
  } catch (error) {
    console.error('Error creating monster:', error.message);
  }
};

// 몬스터 ID로 조회 테스트
const testFindMonsterById = async (id) => {
  try {
    const monster = await findMonsterById(id);
    console.log('Found Monster:', monster); // 조회된 몬스터 정보 출력
  } catch (error) {
    console.error('Error finding monster by ID:', error.message);
  }
};

// 모든 몬스터 조회 테스트
const testFindAllMonsters = async () => {
  try {
    const monsters = await findAllMonsters();
    console.log('All Monsters:', monsters); // 모든 몬스터 출력
  } catch (error) {
    console.error('Error finding all monsters:', error.message);
  }
};

// 몬스터 수정 테스트
const testUpdateMonster = async (id) => {
  try {
    const updatedData = {
      maxHp: 1200,
      atk: 170,
      def: 90,
      criticalProbability: 0.3,
      criticalDamageRate: 1.7,
      moveSpeed: 5.5,
      attackSpeed: 1.3,
    };

    const updatedMonster = await updateMonster(id, updatedData);
    console.log('Updated Monster:', updatedMonster); // 수정된 몬스터 정보 출력
  } catch (error) {
    console.error('Error updating monster:', error.message);
  }
};

// 몬스터 삭제 테스트
const testDeleteMonster = async (id) => {
  try {
    const deletedMonster = await deleteMonster(id);
    console.log('Deleted Monster:', deletedMonster); // 삭제된 몬스터 정보 출력
  } catch (error) {
    console.error('Error deleting monster:', error.message);
  }
};

// 실행 테스트
const runMonsterTests = async () => {
  console.log('Running monster tests...');

  // 몬스터 생성 후, 생성된 몬스터의 ID를 이용하여 나머지 테스트 실행
  const createdMonsterId = await testCreateMonster(); // 몬스터 생성 후 ID 저장
  if (createdMonsterId) {
    await testFindMonsterById(createdMonsterId); // 생성된 몬스터 ID로 조회
    await testFindAllMonsters(); // 모든 몬스터 조회
    await testUpdateMonster(createdMonsterId); // 생성된 몬스터 ID로 수정
    await testDeleteMonster(createdMonsterId); // 생성된 몬스터 ID로 삭제
  }
};

runMonsterTests();
