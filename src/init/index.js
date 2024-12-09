import initBullQueue from './initBullQueue.js';
import { loadGameAssets } from './loadAsset.js';
import { loadProtos } from './loadProtos.js';
import { createReverseMapping } from '../configs/constants/packetId.js';
import logger from '../utils/logger.js';

const initServer = async () => {
  try {
    createReverseMapping();
    await loadProtos();
    await loadGameAssets();
    await initBullQueue();
  } catch (err) {
    logger.error(err);
    process.exit(1); // 에러 발생 시 게임 종료
  }
};

export default initServer;
