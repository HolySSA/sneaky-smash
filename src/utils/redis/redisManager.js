import Redis from 'ioredis';
import configs from '../../configs/config.js';
import logger from '../logger.js';

let redisClient = null;
const { REDIS_HOST, REDIS_PORT, REDIS_PORT2, REDIS_PORT3, REDIS_PASSWORD } = configs;

async function createRedisClient() {
  if (redisClient) return redisClient;

  logger.info('Redis 클러스터 연결 시도...');

  const nodes = [
    { host: REDIS_HOST, port: REDIS_PORT },
    { host: REDIS_HOST, port: REDIS_PORT2 },
    { host: REDIS_HOST, port: REDIS_PORT3 },
  ];

  logger.info('Redis 클러스터 노드 설정:', nodes);

  try {
    redisClient = new Redis.Cluster(nodes, {
      redisOptions: {
        password: REDIS_PASSWORD,
      },
    });

    return new Promise((resolve, reject) => {
      redisClient.on('connect', () => {
        logger.info('Redis 클러스터 노드에 연결 시작됨');
      });

      redisClient.on('ready', () => {
        logger.info('Redis 클러스터 준비 완료!');
        resolve(redisClient);
      });

      redisClient.on('error', (err) => {
        logger.error(`Redis 클러스터 에러: ${err.message}`);
        reject(err);
      });

      redisClient.on('end', () => {
        logger.info('Redis 클러스터 연결 종료');
      });

      redisClient.on('node connected', (node) => {
        logger.info(`노드 연결됨: ${node.options.host}:${node.options.port}`);
      });

      redisClient.on('node disconnected', (node) => {
        logger.warn(`노드 연결 끊김: ${node.options.host}:${node.options.port}`);
      });

      redisClient.on('node error', (err, node) => {
        if (node && node.options) {
          logger.error(`노드 ${node.options.host}:${node.options.port} 에러:`, err);
        } else {
          logger.error('Redis 노드 에러:', err);
        }
      });
    });
  } catch (error) {
    logger.error(`Redis 클라이언트 생성 중 에러: ${error.message}`);
    throw error;
  }
}

const redis = await createRedisClient();

await redis.set('test', 'hi');
console.log(await redis.get('test'));

process.on('SIGINT', async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis 클러스터 연결 종료 완료');
  }
});
export default createRedisClient;
