import Monster from './monster.class.js';
import PathServer from './pathServer.js'; // 패스파인딩 서버와 연결
import { PACKET_ID } from '../../constants/packetId.js';
import createResponse from '../../utils/response/createResponse.js';
import { getUserSessions } from '../../sessions/user.session.js';

class MonsterLogic {
  constructor() {
    this.monsterLists = [];
    this.pathServer = new PathServer();
    this.gameLoopInterval = null;
    this.monsterIndex = 1;

    // 패스파인딩 서버 연결
    this.pathServer
      .connectToUnityServer('127.0.0.1', 6000)
      .then(() => {
        console.log('패스파인딩 서버에 연결되었습니다.');
      })
      .catch((err) => {
        console.error('패스파인딩 서버 연결 실패:', err.message);
      });

    console.log('MonsterLogic 생성됨. 게임 루프 시작.');
    this.startGameLoop();
  }

  addMonster(id, monsterInfo, transform) {
    const monster = new Monster(id, monsterInfo, transform);
    this.monsterLists.push(monster);
  }

  addUniqueId() {
    return this.monsterIndex++;
  }

  sendMonsterMove(monster, userSessions) {
    // 몬스터 데이터 직렬화
    const response = createResponse(PACKET_ID.S_MonsterMove, {
      monsterId: monster.id,
      transform: {
        posX: monster.transform.posX,
        posY: monster.transform.posY,
        posZ: monster.transform.posZ,
        rot: monster.transform.rot, // 추가: 회전값 포함
      },
    });

    // 모든 유저 세션에 데이터 전송
    userSessions.forEach((session) => {
      console.log(
        `몬스터 ID: ${monster.id} 위치 데이터 전송 - (${monster.transform.posX}, ${monster.transform.posY}, ${monster.transform.posZ})`,
      );
      session.socket.write(response); // 데이터 전송
    });
  }

  requestPathAndMove(monster) {
    if (!monster.target) return;

    this.pathServer
      .sendPathRequest(monster.transform, monster.target.transform)
      .then((response) => {
        // response는 S_GetNavPath 메시지에서 디코딩된 값
        const { pathPosition } = response;

        if (pathPosition) {
          // 경로의 첫 번째 점으로 이동
          monster.move({
            x: pathPosition.posX,
            y: pathPosition.posY,
            z: pathPosition.posZ,
          });
        } else {
          console.error(`몬스터 ID: ${monster.id} 경로 데이터가 없습니다.`);
        }
      })
      .catch((err) => {
        console.error(`몬스터 ID: ${monster.id} 경로 요청 실패:`, err.message || err);
      });
  }

  findClosestPlayer(monster, userSessions) {
    let closestDistance = Infinity;
    let closestPlayer = null;

    userSessions.forEach((session) => {
      const { posX, posY, posZ } = session.transform;
      const distance = Math.sqrt(
        (posX - monster.transform.posX) ** 2 +
          (posY - monster.transform.posY) ** 2 +
          (posZ - monster.transform.posZ) ** 2,
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlayer = session;
      }
    });

    return closestPlayer;
  }

  startGameLoop() {
    // 게임 루프 시작
    this.gameLoopInterval = setInterval(() => {
      const userSessions = getUserSessions();

      this.monsterLists.forEach((monster) => {
        // 타겟이 없을 때 가장 가까운 적을 타겟으로 설정
        if (!monster.target) {
          const closestPlayer = this.findClosestPlayer(monster, userSessions);
          if (closestPlayer) {
            monster.target = closestPlayer;
            console.log(
              `${monster.name}이(가) 새로운 타겟을 설정했습니다: (${closestPlayer.transform.posX}, ${closestPlayer.transform.posY}, ${closestPlayer.transform.posZ})`,
            );
          }
        }

        // 타겟이 있을 경우 경로 요청 및 이동
        if (monster.target) {
          this.requestPathAndMove(monster);

          // 모든 유저에게 몬스터 위치 전송
          this.sendMonsterMove(monster, userSessions);

          // 공격 실행
          monster.attack();
        }
      });
    }, 100); // 0.1초마다 업데이트
  }

  stopGameLoop() {
    // 게임 루프 중지
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log('게임 루프 중지됨.');
    }
  }
}

export default MonsterLogic;
