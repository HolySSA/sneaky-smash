import dbPool from '../database.js';
await dbPool.init();
await dbPool.createTables();
