import net from 'net';
import initServer from './init/index.js';
import onConnection from './events/onConnection.js';
import config from './config/config.js';
import { closeAllQueues } from './utils/redis/bull/bullManager.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address());
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });

const shutDownServer = async () => {
  await new Promise((resolve) => {
    server.close(() => {
      console.log('TCP 서버 종료.');
      resolve();
    });
  });

  await closeAllQueues();
  console.log('Bull Queue 정리.');

  // 모든 작업이 완료될 때까지 잠시 대기
  await new Promise((resolve) => setTimeout(resolve, 1000));

  process.exit(0);
};

process.on('SIGTERM', shutDownServer); // 시스템 종료
process.on('SIGINT', shutDownServer); // Ctrl+C
process.on('SIGHUP', shutDownServer); // 터미널 종료
