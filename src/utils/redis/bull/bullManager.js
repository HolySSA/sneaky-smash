import Queue from 'bull';
import { REDIS_HOST, REDIS_PORT } from '../../../constants/env.js';

// 큐 인스턴스 저장 MAP
const queues = new Map();

const defaultOptions = {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  // 기본 작업 옵션
  defaultJobOptions: {
    attempts: 3, // 재시도 횟수
    removeOnComplete: 100, // 완료된 작업 100개까지만 보관
    removeOnFail: 100, // 실패한 작업 100개까지만 보관
  },
};

// 큐 생성
const createQueue = (queueName) => {
  if (!queues.has(queueName)) {
    const queue = new Queue(queueName, defaultOptions);

    // Queue 이벤트 리스너
    queue.on('error', (err) => {
      console.error(`Queue ${queueName} 에러: `, err);
    });

    queue.on('waiting', (jobId) => {
      console.log(`Job ${jobId} 대기.`);
    });

    queue.on('active', (job) => {
      console.log(`Job ${job.id} 실행.`);
    });

    queue.on('completed', (job) => {
      console.log(`Job ${job.id} 완료.`);
    });

    queue.on('failed', (job, err) => {
      console.error(`Job ${job.id} 실패: `, err);
    });

    queues.set(queueName, queue);
  }

  return queues.get(queueName);
};

// 큐 불러오기
const getQueue = (queueName) => {
  return queues.get(queueName);
};

// 모든 큐 불러오기
const getAllQueues = () => {
  return Array.from(queues.values());
};

// 큐 제거
const removeQueue = async (queueName) => {
  const queue = queues.get(queueName);
  if (queue) {
    await queue.close();
    queues.delete(queueName);
  }
};

// 모든 큐 종료
const closeAllQueues = async () => {
  const closePromises = Array.from(queues.values()).map((queue) => queue.close());
  await Promise.all(closePromises);
  queues.clear();
};

export { createQueue, getQueue, getAllQueues, removeQueue, closeAllQueues };
