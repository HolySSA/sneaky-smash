import net from 'net';
import { createInterface } from 'readline';
import initServer from './init/index.js';
import onConnection from './events/onConnection.js';
import { closeAllQueues } from './utils/redis/bull/bullManager.js';
import configs from './configs/config.js';
import logger from './utils/logger.js';

const { SERVER_BIND, SERVER_PORT } = configs;

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(SERVER_PORT, SERVER_BIND, () => {
      const bindInfo = server.address();
      logger.info(`서버가 ${bindInfo.address}:${bindInfo.port}에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });

const shutDownServer = async () => {
  await new Promise((resolve) => {
    server.close(() => {
      logger.info('TCP 서버 종료.');
      resolve();
    });
  });

  process.removeAllListeners('SIGINT');
  process.removeAllListeners('SIGTERM');
  process.removeAllListeners('SIGHUP');

  logger.info('Bull Queue 정리.');
  await closeAllQueues();
  logger.info('서버 종료 완료.');
  process.exit(0);
};

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

process.on('SIGTERM', () => {
  shutDownServer(); // 시스템 종료
});
process.on('SIGINT', () => {
  shutDownServer(); // Ctrl+C
});
process.on('SIGHUP', () => {
  shutDownServer(); // 터미널 종료
});
