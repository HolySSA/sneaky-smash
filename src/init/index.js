import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadProtos();
  } catch (err) {
    console.error(err);
    process.exit(1); // 에러 발생 시 게임 종료
  }
};

export default initServer;
