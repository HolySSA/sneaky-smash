import { enterQueue } from '../utils/redis/bull/queues.js';
import logger from '../utils/logger.js';
// 프로세서 등록
import '../utils/redis/bull/enter/process.enter.queue.js';

const initBullQueue = () => {
  if (enterQueue) {
    logger.info('Enter Queue 초기화 완료');
  }
};

export default initBullQueue;
