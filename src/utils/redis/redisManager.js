import Redis from 'ioredis';
import configs from '../../configs/config.js';
import logger from '../logger.js';

let redisClient = null;
const { REDIS_HOST, REDIS_PORT, REDIS_PORT2, REDIS_PORT3, REDIS_PASSWORD } = configs;

function createRedisClient() {
  logger.info('Redis 클러스터 연결 시도...');

  if (redisClient) return redisClient;

  try {
    const nodes = [
      { host: REDIS_HOST, port: REDIS_PORT },
      { host: REDIS_HOST, port: REDIS_PORT2 },
      { host: REDIS_HOST, port: REDIS_PORT3 },
    ];

    logger.info('Redis 클러스터 노드 설정:', nodes);

    redisClient = new Redis.Cluster(nodes, {
      redisOptions: {
        password: REDIS_PASSWORD,
        connectTimeout: 30000,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          const delay = Math.min(times * 100, 3000);
          return delay;
        },
      },
      clusterRetryStrategy(times) {
        logger.info(`클러스터 재연결 시도 ${times}번째...`);
        if (times >= 3) {
          logger.error('클러스터 연결 실패, 재시도 중단');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      scaleReads: 'master',
      enableReadyCheck: true,
      maxRedirections: 16,
    });

    logger.info('Redis 클라이언트 인스턴스 생성됨');

    redisClient.on('connect', () => {
      logger.info('Redis 클러스터 노드에 연결됨');
    });

    redisClient.on('ready', () => {
      logger.info('Redis 클러스터 준비 완료!');
      // 연결 테스트
      redisClient
        .ping()
        .then(() => {
          logger.info('Redis 클러스터 PING 성공');
        })
        .catch((err) => {
          logger.error('Redis 클러스터 PING 실패:', err);
        });
    });

    redisClient.on('error', (err) => {
      logger.error('Redis 클러스터 에러:', err.message);
    });

    redisClient.on('end', () => {
      logger.info('Redis 클러스터 연결 종료');
      redisClient = null;
    });

    redisClient.on('node error', (err, node) => {
      if (node && node.options) {
        logger.error(`노드 ${node.options.host}:${node.options.port} 에러:`, err);
      } else {
        logger.error('Redis 노드 에러:', err);
      }
    });

    return redisClient;
  } catch (error) {
    logger.error('Redis 클라이언트 생성 중 에러:', error);
    throw error;
  }
}

const redis = createRedisClient();
export default redis;
