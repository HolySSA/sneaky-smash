import {
  createBoss,
  findBossById,
  findAllBosses,
  updateBoss,
  deleteBoss,
} from '../boss/boss.db.js'; // 보스 관련 DB 함수들 임포트

// 보스 생성 테스트
const testCreateBoss = async () => {
  try {
    const newBoss = {
      maxHp: 2000,
      atk: 250,
      def: 150,
      criticalProbability: 0.3,
      criticalDamageRate: 2.0,
      moveSpeed: 4.0,
      attackSpeed: 1.5,
    };

    const createdBoss = await createBoss(
      newBoss.maxHp,
      newBoss.atk,
      newBoss.def,
      newBoss.criticalProbability,
      newBoss.criticalDamageRate,
      newBoss.moveSpeed,
      newBoss.attackSpeed,
    );
    console.log('Created Boss:', createdBoss); // 생성된 보스 정보 출력

    return createdBoss.id; // 생성된 보스의 ID 반환
  } catch (error) {
    console.error('Error creating boss:', error.message);
  }
};

// 보스 ID로 조회 테스트
const testFindBossById = async (id) => {
  try {
    const boss = await findBossById(id);
    console.log('Found Boss:', boss); // 조회된 보스 정보 출력
  } catch (error) {
    console.error('Error finding boss by ID:', error.message);
  }
};

// 모든 보스 조회 테스트
const testFindAllBosses = async () => {
  try {
    const bosses = await findAllBosses();
    console.log('All Bosses:', bosses); // 모든 보스 출력
  } catch (error) {
    console.error('Error finding all bosses:', error.message);
  }
};

// 보스 수정 테스트
const testUpdateBoss = async (id) => {
  try {
    const updatedData = {
      maxHp: 2200,
      atk: 270,
      def: 160,
      criticalProbability: 0.35,
      criticalDamageRate: 2.2,
      moveSpeed: 4.2,
      attackSpeed: 1.6,
    };

    const updatedBoss = await updateBoss(
      id,
      updatedData.maxHp,
      updatedData.atk,
      updatedData.def,
      updatedData.criticalProbability,
      updatedData.criticalDamageRate,
      updatedData.moveSpeed,
      updatedData.attackSpeed,
    );
    console.log('Updated Boss:', updatedBoss); // 수정된 보스 정보 출력
  } catch (error) {
    console.error('Error updating boss:', error.message);
  }
};

// 보스 삭제 테스트
const testDeleteBoss = async (id) => {
  try {
    const deletedBoss = await deleteBoss(id);
    console.log('Deleted Boss:', deletedBoss); // 삭제된 보스 정보 출력
  } catch (error) {
    console.error('Error deleting boss:', error.message);
  }
};

// 실행 테스트
const runBossTests = async () => {
  console.log('Running boss tests...');

  // 보스 생성 후, 생성된 보스의 ID를 이용하여 나머지 테스트 실행
  const createdBossId = await testCreateBoss(); // 보스 생성 후 ID 저장
  if (createdBossId) {
    await testFindBossById(createdBossId); // 생성된 보스 ID로 조회
    await testFindAllBosses(); // 모든 보스 조회
    await testUpdateBoss(createdBossId); // 생성된 보스 ID로 수정
    await testDeleteBoss(createdBossId); // 생성된 보스 ID로 삭제
  }
};

runBossTests();
