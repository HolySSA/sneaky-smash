// 중앙 집중식 관리
import dotenv from 'dotenv';

dotenv.config();

export const HOST = process.env.HOST || '127.0.0.1';
export const PORT = process.env.PORT || 3000;

export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB_NAME = process.env.DB_NAME || 'database';
export const DB_USER = process.env.DB_USER || 'user';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3000;

export const REDIS_URL = process.env.REDIS_URL || undefined;
export const REDIS_PORT = process.env.REDIS_PORT || 6396;
export const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'password';
