import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

redis.on('connect', () => {
  console.log('Redis 연결.');
});

redis.on('ready', () => {
  console.log('Redis 준비.');
});

redis.on('error', (err) => {
  console.error('Redis 연결 에러:', err);
});

redis.on('end', () => {
  console.log('Redis 연결 종료.');
});

export default redis;
