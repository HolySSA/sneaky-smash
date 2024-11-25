import {
  createDungeon,
  findDungeonById,
  findAllDungeons,
  updateDungeon,
  deleteDungeon,
} from '../dungeon/dungeon.db.js'; // 던전 관련 DB 함수들 임포트

// 던전 생성 테스트
const testCreateDungeon = async () => {
  try {
    const stageList = [
      { stageName: 'Stage 1', difficulty: 'Easy' },
      { stageName: 'Stage 2', difficulty: 'Medium' },
      { stageName: 'Stage 3', difficulty: 'Hard' },
    ];

    const createdDungeon = await createDungeon(stageList);
    console.log('Created Dungeon:', createdDungeon); // 생성된 던전 정보 출력

    return createdDungeon.id; // 생성된 던전의 ID 반환
  } catch (error) {
    console.error('Error creating dungeon:', error.message);
  }
};

// 던전 ID로 조회 테스트
const testFindDungeonById = async (id) => {
  try {
    const dungeon = await findDungeonById(id);
    console.log('Found Dungeon:', dungeon); // 조회된 던전 정보 출력
  } catch (error) {
    console.error('Error finding dungeon by ID:', error.message);
  }
};

// 모든 던전 조회 테스트
const testFindAllDungeons = async () => {
  try {
    const dungeons = await findAllDungeons();
    console.log('All Dungeons:', dungeons); // 모든 던전 출력
  } catch (error) {
    console.error('Error finding all dungeons:', error.message);
  }
};

// 던전 수정 테스트
const testUpdateDungeon = async (id) => {
  try {
    const updatedStageList = [
      { stageName: 'Stage 1', difficulty: 1 },
      { stageName: 'Stage 2', difficulty: 3 }, // 난이도 수정
    ];

    const updatedDungeon = await updateDungeon(id, updatedStageList);
    console.log('Updated Dungeon:', updatedDungeon); // 수정된 던전 정보 출력
  } catch (error) {
    console.error('Error updating dungeon:', error.message);
  }
};

// 던전 삭제 테스트
const testDeleteDungeon = async (id) => {
  try {
    const deletedDungeon = await deleteDungeon(id);
    console.log('Deleted Dungeon:', deletedDungeon); // 삭제된 던전 정보 출력
  } catch (error) {
    console.error('Error deleting dungeon:', error.message);
  }
};

// 실행 테스트
const runDungeonTests = async () => {
  console.log('Running dungeon tests...');

  // 던전 생성 후, 생성된 던전의 ID를 이용하여 나머지 테스트 실행
  const createdDungeonId = await testCreateDungeon(); // 던전 생성 후 ID 저장
  if (createdDungeonId) {
    await testFindDungeonById(createdDungeonId); // 생성된 던전 ID로 조회
    await testFindAllDungeons(); // 모든 던전 조회
    await testUpdateDungeon(createdDungeonId); // 생성된 던전 ID로 수정
    await testDeleteDungeon(createdDungeonId); // 생성된 던전 ID로 삭제
  }
};

runDungeonTests();
