import toCamelCase from '../../utils/transformCase.js'; // toCamelCase import

const handleDbQuery = async (queryFn, queryParams, isArray = false) => {
  try {
    const [query, ...params] = Array.isArray(queryParams) ? queryParams : [queryParams];

    const [rows, fields] = await queryFn(query, params);

    if (!rows || rows.length === 0) {
      return isArray ? [] : null;
    }

    // 항상 배열로 변환하여 반환 (결과가 배열이 아닌 경우에도 배열로 처리)
    const result = isArray ? rows.map((row) => toCamelCase(row)) : [toCamelCase(rows[0])];

    let response = { rows: result };

    // insertId 확인 및 반환 (rows에서 insertId를 가져오기)
    if (rows.insertId !== undefined) {
      response.insertId = rows.insertId;
    }

    // affectedRows 확인 및 반환 (fields에서 affectedRows를 가져오기)
    if (fields && fields.affectedRows !== undefined) {
      response.affectedRows = fields.affectedRows;
    }

    return response;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

export default handleDbQuery;
