import { createReverseMapping } from '../constants/packetId.js';
import initBullQueue from './initBullQueue.js';
import { loadGameAssets } from './loadAsset.js';
import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    createReverseMapping();
    await loadProtos();
    await loadGameAssets();
    await initBullQueue();
  } catch (err) {
    console.error(err);
    process.exit(1); // 에러 발생 시 게임 종료
  }
};

export default initServer;
