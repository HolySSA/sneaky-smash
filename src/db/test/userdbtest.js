import {
  createUser,
  findUserByAccount,
  findAllUsers,
  updateUser,
  deleteUser,
} from '../user/user.db.js'; // user.db.js의 함수들 임포트

let createdUserId = null; // 생성된 사용자 ID를 저장할 변수

// 사용자 생성 테스트
const testCreateUser = async () => {
  try {
    const account = 'testuser1';
    const password = 'password123';

    const newUser = await createUser(account, password);
    createdUserId = newUser.id; // 생성된 사용자 ID 저장
    console.log('Created User:', newUser); // 생성된 사용자 정보 출력
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

// 사용자 계정으로 찾기 테스트
const testFindUserByAccount = async () => {
  try {
    const account = 'testuser1'; // 이미 생성한 계정으로 조회

    const user = await findUserByAccount(account);
    console.log('Found User:', user); // 조회된 사용자 정보 출력
  } catch (error) {
    console.error('Error finding user:', error.message);
  }
};

// 모든 사용자 조회 테스트
const testFindAllUsers = async () => {
  try {
    const users = await findAllUsers();
    console.log('All Users:', users); // 모든 사용자 출력
  } catch (error) {
    console.error('Error finding all users:', error.message);
  }
};

// 사용자 수정 테스트
const testUpdateUser = async () => {
  try {
    if (!createdUserId) {
      throw new Error('No user created for update test');
    }

    const updatedData = {
      account: 'updateduser',
      password: 'newPassword123',
    };

    const updatedUser = await updateUser(createdUserId, updatedData);
    console.log('Updated User:', updatedUser); // 수정된 사용자 정보 출력
  } catch (error) {
    console.error('Error updating user:', error.message);
  }
};

// 사용자 삭제 테스트
const testDeleteUser = async () => {
  try {
    if (!createdUserId) {
      throw new Error('No user created for delete test');
    }

    const deletedUser = await deleteUser(createdUserId);
    console.log('Deleted User:', deletedUser); // 삭제된 사용자 정보 출력
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
};

// 실행 테스트
const runTests = async () => {
  console.log('Running tests...');

  // 테스트 순서대로 실행
  // await testCreateUser();
  await testFindUserByAccount();
  // await testFindAllUsers();
  // await testUpdateUser();
  // await testDeleteUser();
};

runTests();
