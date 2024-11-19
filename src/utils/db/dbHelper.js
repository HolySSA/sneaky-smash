const handleDbQuery = async (query, params) => {
    try {
      const [rows] = await query(params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;  // 예외를 호출자에게 전달
    }
  };
  
export default handleDbQuery;