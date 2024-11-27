import { enterQueue } from '../utils/redis/bull/queues.js';

// 프로세서 등록
import '../utils/redis/bull/enter/process.enter.queue.js';

const initBullQueue = () => {
  if (enterQueue) {
    console.log('Enter Queue 초기화 완료');
  }
};

export default initBullQueue;
