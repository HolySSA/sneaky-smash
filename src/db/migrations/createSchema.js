import dbPool from '../database.js';
await dbPool.init();
await dbPool.createTables();

// 프로세스 강제 종료
process.exit(0);
