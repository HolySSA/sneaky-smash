import net from 'net';
import { createInterface } from 'readline';
import initServer from './init/index.js';
import onConnection from './events/onConnection.js';
import configs from './configs/configs.js';
import logger from './utils/logger.js';
import { getRedis } from './utils/redis/redisManager.js';
import AsyncExitHook from 'async-exit-hook';
import { userSessions } from './sessions/sessions.js';

const { SERVER_BIND, SERVER_PORT, ServerUUID } = configs;

const clients = [];
const server = net.createServer((socket) => {
  clients.push(socket);
  onConnection(socket);
});
let isShuttingDown = false;

initServer()
  .then(() => {
    server.listen(SERVER_PORT, SERVER_BIND, () => {
      const bindInfo = server.address();
      logger.info(`Server[${ServerUUID}] is on ${bindInfo.address}:${bindInfo.port}`);
    });
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });

const shutDownServer = async () => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  try {
    await new Promise((resolve) => {
      for (const socket of clients) {
        socket.destroy();
      }

      server.close(() => {
        logger.info('TCP 서버 종료.');
        resolve();
      });
    });
    await deleteKeysByPattern();
  } catch (error) {
    logger.error(error);
  } finally {
    logger.info('서버 종료 완료');
    process.exit(0);
  }
};

const deleteKeysByPattern = async () => {
  const redis = await getRedis();
  let cursor = '0';
  const keysToDelete = [];
  const pattern = `${ServerUUID}:*`;
  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;
    if (keys.length > 0) {
      keysToDelete.push(...keys);
    }
  } while (cursor !== '0');

  if (keysToDelete.length > 0) {
    await redis.unlink(...keysToDelete);
  }
};

AsyncExitHook(async (done) => {
  await shutDownServer();
  done();
});

// Windows SIGINT (Ctrl+C) 처리
if (process.platform === 'win32') {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}
