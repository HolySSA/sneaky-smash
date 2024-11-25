import toCamelCase from '../../utils/transformCase.js'; // toCamelCase import

const handleDbQuery = async (queryFn, queryParams, isArray = false) => {
  try {
    // 쿼리 파라미터 배열을 강제로 처리
    const [query, params] = Array.isArray(queryParams) ? queryParams : [queryParams, []];

    const [rows] = await queryFn(query, params); // queryFn은 dbPool.query

    // 결과를 카멜케이스로 변환
    const result = isArray ? rows.map((row) => toCamelCase(row)) : toCamelCase(rows[0]);

    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; // 예외를 호출자에게 전달
  }
};

export default handleDbQuery;

// DB 를 읽어올 때, 자동으로 try - catch 문으로 예외 처리하고 camelCase 적용.
