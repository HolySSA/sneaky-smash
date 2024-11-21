import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../../constants/env.js';

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
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
