import {
  createStage,
  findStageById,
  findAllStages,
  updateStage,
  deleteStage,
} from '../stage/stage.db.js'; // stage.db.js의 함수들 임포트

let createdStageId = null; // 생성된 스테이지 ID를 저장할 변수

// 스테이지 생성 테스트
const testCreateStage = async () => {
  try {
    const MonsterID = 1;
    const MonsterCount = 10;

    const newStage = await createStage(MonsterID, MonsterCount);
    createdStageId = newStage.id; // 생성된 스테이지 ID 저장
    console.log('Created Stage:', newStage); // 생성된 스테이지 정보 출력
  } catch (error) {
    console.error('Error creating stage:', error.message);
  }
};

// 스테이지 ID로 조회 테스트
const testFindStageById = async () => {
  try {
    if (!createdStageId) {
      throw new Error('No stage created for find test');
    }

    const stage = await findStageById(createdStageId);
    console.log('Found Stage:', stage); // 조회된 스테이지 정보 출력
  } catch (error) {
    console.error('Error finding stage by ID:', error.message);
  }
};

// 모든 스테이지 조회 테스트
const testFindAllStages = async () => {
  try {
    const stages = await findAllStages();
    if (stages.length > 0) {
      console.log('All Stages:', stages); // 모든 스테이지 출력
    } else {
      console.log('No stages found');
    }
  } catch (error) {
    console.error('Error finding all stages:', error.message);
  }
};

// 스테이지 수정 테스트
const testUpdateStage = async () => {
  try {
    if (!createdStageId) {
      throw new Error('No stage created for update test');
    }

    const updatedData = {
      MonsterID: 2,
      MonsterCount: 15,
    };

    const updatedStage = await updateStage(
      createdStageId,
      updatedData.MonsterID,
      updatedData.MonsterCount,
    );
    console.log('Updated Stage:', updatedStage); // 수정된 스테이지 정보 출력
  } catch (error) {
    console.error('Error updating stage:', error.message);
  }
};

// 스테이지 삭제 테스트
const testDeleteStage = async () => {
  try {
    if (!createdStageId) {
      throw new Error('No stage created for delete test');
    }

    const deletedStage = await deleteStage(createdStageId);
    console.log('Deleted Stage:', deletedStage); // 삭제된 스테이지 정보 출력
  } catch (error) {
    console.error('Error deleting stage:', error.message);
  }
};

// 실행 테스트
const runTests = async () => {
  console.log('Running tests...');

  // 테스트 순서대로 실행
  await testCreateStage();
  await testFindStageById();
  await testFindAllStages();
  await testUpdateStage();
  await testDeleteStage();
};

runTests();
