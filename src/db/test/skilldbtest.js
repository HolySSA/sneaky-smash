import {
  createSkill,
  findSkillById,
  findAllSkills,
  updateSkill,
  deleteSkill,
} from '../skill/skill.db.js'; // skill.db.js의 함수들 임포트

let createdSkillId = null; // 생성된 스킬 ID를 저장할 변수

// 스킬 생성 테스트
const testCreateSkill = async () => {
  try {
    const DamageRate = 1.5;
    const CoolTime = 10;
    const IncreasePercent = 5;
    const DecreasePercent = 3;

    const newSkill = await createSkill(DamageRate, CoolTime, IncreasePercent, DecreasePercent);
    createdSkillId = newSkill.id; // 생성된 스킬 ID 저장
    console.log('Created Skill:', newSkill); // 생성된 스킬 정보 출력
  } catch (error) {
    console.error('Error creating skill:', error.message);
  }
};

// 스킬 ID로 조회 테스트
const testFindSkillById = async () => {
  try {
    if (!createdSkillId) {
      throw new Error('No skill created for find test');
    }

    const skill = await findSkillById(createdSkillId);
    console.log('Found Skill:', skill); // 조회된 스킬 정보 출력
  } catch (error) {
    console.error('Error finding skill by ID:', error.message);
  }
};

// 모든 스킬 조회 테스트
const testFindAllSkills = async () => {
  try {
    const skills = await findAllSkills();
    if (skills.length > 0) {
      console.log('All Skills:', skills); // 모든 스킬 출력
    } else {
      console.log('No skills found');
    }
  } catch (error) {
    console.error('Error finding all skills:', error.message);
  }
};

// 스킬 수정 테스트
const testUpdateSkill = async () => {
  try {
    if (!createdSkillId) {
      throw new Error('No skill created for update test');
    }

    const updatedData = {
      DamageRate: 2.0,
      CoolTime: 8,
      IncreasePercent: 10,
      DecreasePercent: 5,
    };

    const updatedSkill = await updateSkill(
      createdSkillId,
      updatedData.DamageRate,
      updatedData.CoolTime,
      updatedData.IncreasePercent,
      updatedData.DecreasePercent,
    );
    console.log('Updated Skill:', updatedSkill); // 수정된 스킬 정보 출력
  } catch (error) {
    console.error('Error updating skill:', error.message);
  }
};

// 스킬 삭제 테스트
const testDeleteSkill = async () => {
  try {
    if (!createdSkillId) {
      throw new Error('No skill created for delete test');
    }

    const deletedSkill = await deleteSkill(createdSkillId);
    console.log('Deleted Skill:', deletedSkill); // 삭제된 스킬 정보 출력
  } catch (error) {
    console.error('Error deleting skill:', error.message);
  }
};

// 실행 테스트
const runTests = async () => {
  console.log('Running tests...');

  // 테스트 순서대로 실행
  await testCreateSkill();
  await testFindSkillById();
  await testFindAllSkills();
  await testUpdateSkill();
  await testDeleteSkill();
};

runTests();
