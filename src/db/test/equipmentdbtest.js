import {
  createEquipment,
  findEquipmentById,
  findAllEquipments,
  updateEquipment,
  deleteEquipment,
} from '../equipment/equipment.db.js'; // 장비 관련 DB 함수들 임포트

// 장비 생성 테스트
const testCreateEquipment = async () => {
  try {
    const newEquipment = {
      gold: 500,
      ATK: 100,
      DEF: 50,
      MaxHp: 500,
      CriticalDamageRate: 1.5,
      CriticalProbability: 0.25,
      CurHp: 500,
      MoveSpeed: 3,
    };

    const createdEquipment = await createEquipment(newEquipment);
    console.log('Created Equipment:', createdEquipment); // 생성된 장비 정보 출력

    return createdEquipment.id; // 생성된 장비의 ID 반환
  } catch (error) {
    console.error('Error creating equipment:', error.message);
  }
};

// 장비 ID로 조회 테스트
const testFindEquipmentById = async (id) => {
  try {
    const equipment = await findEquipmentById(id);
    console.log('Found Equipment:', equipment); // 조회된 장비 정보 출력
  } catch (error) {
    console.error('Error finding equipment by ID:', error.message);
  }
};

// 모든 장비 조회 테스트
const testFindAllEquipments = async () => {
  try {
    const equipments = await findAllEquipments();
    console.log('All Equipments:', equipments); // 모든 장비 출력
  } catch (error) {
    console.error('Error finding all equipments:', error.message);
  }
};

// 장비 수정 테스트
const testUpdateEquipment = async (id) => {
  try {
    const updatedData = {
      gold: 600,
      ATK: 120,
      DEF: 60,
      MaxHp: 600,
      CriticalDamageRate: 1.7,
      CriticalProbability: 0.3,
      CurHp: 600,
      MoveSpeed: 4,
    };

    const updatedEquipment = await updateEquipment(id, updatedData);
    console.log('Updated Equipment:', updatedEquipment); // 수정된 장비 정보 출력
  } catch (error) {
    console.error('Error updating equipment:', error.message);
  }
};

// 장비 삭제 테스트
const testDeleteEquipment = async (id) => {
  try {
    const deletedEquipment = await deleteEquipment(id);
    console.log('Deleted Equipment:', deletedEquipment); // 삭제된 장비 정보 출력
  } catch (error) {
    console.error('Error deleting equipment:', error.message);
  }
};

// 실행 테스트
const runEquipmentTests = async () => {
  console.log('Running equipment tests...');

  // 장비 생성 후, 생성된 장비의 ID를 이용하여 나머지 테스트 실행
  const createdEquipmentId = await testCreateEquipment(); // 장비 생성 후 ID 저장
  if (createdEquipmentId) {
    await testFindEquipmentById(createdEquipmentId); // 생성된 장비 ID로 조회
    await testFindAllEquipments(); // 모든 장비 조회
    await testUpdateEquipment(createdEquipmentId); // 생성된 장비 ID로 수정
    await testDeleteEquipment(createdEquipmentId); // 생성된 장비 ID로 삭제
  }
};

runEquipmentTests();
