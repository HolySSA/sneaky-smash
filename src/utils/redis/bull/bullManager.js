import Queue from 'bull';
import configs from '../../../configs/config.js';
import logger from '../../logger.js';
import Redis from 'ioredis';
import redis from '../redisManager.js';
const { REDIS_HOST, BULL_PORT, REDIS_PORT, REDIS_PASSWORD } = configs;

// 큐 인스턴스 저장 MAP
const queues = new Map();

const defaultJobOptions = {
  attempts: 3, // 재시도 횟수
  removeOnComplete: 100, // 완료된 작업 100개까지만 보관
  removeOnFail: 100, // 실패한 작업 100개까지만 보관
};

// 큐 생성
const createQueue = (queueName) => {
  if (!queues.has(queueName)) {
    const queue = new Queue(queueName, {
      createClient: (type) => {
        if (type === 'client' || type === 'subscriber') {
          logger.info(`Bull에서 Redis ${type} 클라이언트 생성`);

          // Bull에서 사용하는 Redis 클라이언트는 enableReadyCheck와 maxRetriesPerRequest 비활성화
          return new Redis.Cluster(
            redis.nodes('master').map((node) => ({
              host: node.options.host,
              port: node.options.port,
            })),
            {
              redisOptions: {
                password: redis.options.redisOptions.password,
                enableReadyCheck: false,
                maxRetriesPerRequest: null,
              },
            },
          );
        }
        // 기본 Redis 연결 (작업 저장 용도)
        return redis.duplicate();
      },
    });

    // Queue 이벤트 리스너
    queue.on('error', (err) => {
      logger.error(err);
    });

    queue.on('waiting', (jobId) => {
      logger.info(`Job ${jobId} 대기.`);
    });

    queue.on('active', (job) => {
      logger.info(`Job ${job.id} 실행.`);
    });

    queue.on('completed', (job) => {
      logger.info(`Job ${job.id} 완료.`);
    });

    queue.on('failed', (job, err) => {
      logger.error(`Job ${job.id} 실패: `, err);
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
  for (const queue of queues.values()) {
    // 각 작업 비동기로 실행
    await queue.pause(true);
    await queue.empty();

    // 모든 작업 삭제
    await Promise.all([
      queue.clean(0, 'completed'),
      queue.clean(0, 'failed'),
      queue.clean(0, 'delayed'),
      queue.clean(0, 'wait'),
      queue.clean(0, 'active'),
    ]);

    // 모든 키 삭제
    await queue.obliterate({ force: true });
    await queue.close();
  }

  queues.clear();
  logger.info('모든 Bull Queue 정리.');
};

export { createQueue, getQueue, getAllQueues, removeQueue, closeAllQueues };
