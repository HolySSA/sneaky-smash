const SQL_QUERIES = {
  // 사용자 생성
  CREATE_USER: `
    INSERT INTO user (account, password)
    VALUES (?, ?)
  `,

  // 사용자 계정으로 찾기
  FIND_USER_BY_ACCOUNT: `
    SELECT * FROM user WHERE account = ?
  `,

  // 모든 사용자 조회
  FIND_ALL_USERS: `
    SELECT * FROM user
  `,

  // 사용자 수정
  UPDATE_USER: `
    UPDATE user
    SET account = ?, password = ?
    WHERE id = ?
  `,

  // 사용자 삭제
  DELETE_USER: `
    DELETE FROM user WHERE id = ?
  `,
};

export default SQL_QUERIES;
