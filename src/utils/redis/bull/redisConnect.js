import Redis from 'ioredis';
import config from '../../../config/config.js';

export const redisClient = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password,
  db: 0, // 사용할 DB 번호
});

// redis 오류 처리
redisClient.on('error', (err) => {
  console.error('Redis 클라이언트 오류:', err.errno);
  switch (err.errno) {
    case -4078:
      console.error('Redis DB와 연결할 수 없습니다. Redis 상태를 확인해주세요.');
      break;
    default:
      console.error('알 수 없는 오류코드:', JSON.stringify(err));
  }

  //   console.log('서버 접속 재시도 중 ...');
  //   setTimeout(() => connectRedis(), 10000); // 10초 후 재시도
  console.log('서버를 종료합니다.');
  process.exit(1); // 바로 종료
});

// redis 연결
export const connectRedis = async () => {
  try {
    if (redisClient.status === 'ready') {
      console.log('Redis가 이미 연결되었습니다.');
    } else if (redisClient.status === 'connecting') {
      console.log('Redis 연결 중...');
    } else {
      console.log('Redis 상태:', redisClient.status, '... 연결 중');
      await redisClient.connect();
      console.log('Redis에 연결되었습니다.');
    }
  } catch (error) {
    console.error('Redis에 연결할 수 없습니다:', error);
    // SetTimeout(() => connectRedis(), 10000); // 10초 후 재시도
  }
};

// 애플리케이션이 시작 될 때, Redis 연결 시도
await connectRedis();
