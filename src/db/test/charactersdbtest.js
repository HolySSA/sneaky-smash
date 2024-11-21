import {
  createCharacter,
  findCharacterByUserId,
  findAllCharacters,
  updateCharacter,
  deleteCharacter,
} from '../character/characters.db.js'; // 캐릭터 관련 DB 함수들 임포트
import {
  createUser,
  findUserByAccount,
  findAllUsers,
  updateUser,
  deleteUser,
} from '../user/user.db.js'; // user.db.js의 함수들 임포트

// 사용자 생성 및 ID로 캐릭터 생성 테스트
const testCreateCharacter = async () => {
  try {
    const account = 'testuser';
    const password = 'password123';

    // 사용자 생성
    const newUser = await createUser(account, password);
    const { id: userId } = newUser; // 생성된 사용자의 ID

    console.log('Created User:', newUser);

    // 생성된 사용자 ID로 캐릭터 생성
    const nickname = 'Warrior';
    const characterClass = 'Warrior';
    const gold = 1000;

    const newCharacter = await createCharacter(userId, nickname, characterClass, gold);
    console.log('Created Character:', newCharacter); // 생성된 캐릭터 정보 출력
  } catch (error) {
    console.error('Error creating character:', error.message);
  }
};

// 사용자 ID로 캐릭터 조회 테스트
const testFindCharacterByUserId = async () => {
  try {
    const account = 'testuser'; // 예시로 생성된 계정 조회

    // 사용자 조회
    const user = await findUserByAccount(account);

    console.log('user:', user);
    const { id: userId } = user;

    // 해당 사용자 ID로 캐릭터 조회
    const character = await findCharacterByUserId(userId);
    if (!character) {
      throw new Error(`Character for user with ID ${userId} not found.`);
    }
    console.log('Found Character:', character); // 조회된 캐릭터 정보 출력
  } catch (error) {
    console.error('Error finding character by user ID:', error.message);
  }
};

// 모든 캐릭터 조회 테스트
const testFindAllCharacters = async () => {
  try {
    const characters = await findAllCharacters();
    console.log('All Characters:', characters); // 모든 캐릭터 정보 출력
  } catch (error) {
    console.error('Error finding all characters:', error.message);
  }
};

// 캐릭터 수정 테스트
const testUpdateCharacter = async () => {
  try {
    const account = 'testuser'; // 예시로 생성된 계정 조회

    // 사용자 조회
    const user = await findUserByAccount(account);
    const { id: userId } = user;

    const updatedData = {
      nickname: 'Knight', // 새로운 닉네임
      class: 'Knight', // 새로운 클래스
      gold: 1500, // 새로운 금액
    };

    // 캐릭터 수정
    const updatedCharacter = await updateCharacter(userId, updatedData);
    console.log('Updated Character:', updatedCharacter); // 수정된 캐릭터 정보 출력
  } catch (error) {
    console.error('Error updating character:', error.message);
  }
};

// 캐릭터 삭제 테스트
const testDeleteCharacter = async () => {
  try {
    const account = 'testuser'; // 예시로 생성된 계정 조회

    // 사용자 조회
    const user = await findUserByAccount(account);
    const { id: userId } = user;

    // 캐릭터 삭제
    const deletedCharacter = await deleteCharacter(userId);
    console.log('Deleted Character:', deletedCharacter); // 삭제된 캐릭터 정보 출력
  } catch (error) {
    console.error('Error deleting character:', error.message);
  }
};

const testDeleteUser = async () => {
  try {
    const account = 'testuser'; // 예시로 생성된 계정 조회

    // 사용자 조회
    const user = await findUserByAccount(account);
    const { id: userId } = user;

    // 사용자 삭제
    const deletedUser = await deleteUser(userId);
    console.log('Deleted User:', deletedUser); // 삭제된 사용자 정보 출력
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
};

// 실행 테스트
const runCharacterTests = async () => {
  console.log('Running character tests...');

  // 테스트 순서대로 실행
  await testCreateCharacter();
  await testFindCharacterByUserId();
  await testFindAllCharacters();
  await testUpdateCharacter();
  await testDeleteCharacter();
  await testDeleteUser();
};

runCharacterTests();
