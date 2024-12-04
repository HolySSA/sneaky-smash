import Monster from './monster.class.js';
import PathServer from './pathServer.js'; // 패스파인딩 서버와 연결
import { PACKET_ID } from '../../constants/packetId.js';
import createResponse from '../../utils/response/createResponse.js';
import { getGameAssets } from '../../init/loadAsset.js';
import monsterSpawnNotification from '../../handler/monster/monsterSpawn.notification.js';

class MonsterLogic {
  constructor(dungeonInstance) {
    this.dungeonInstance = dungeonInstance;
    this.monsterLists = [];
    this.pathServer = new PathServer();
    this.gameLoopInterval = null;
    this.monsterIndex = 1;

    this.monsterLogicInterval = 100;
    this.spawnInterval = 1000 * 10; // 10초
    this.spawnZones = [
      {
        id: 1,
        maxCount: 5,
        transform: [
          { posX: -5, posY: -4, posZ: 75 },
          { posX: 5, posY: -4, posZ: 75 },
        ],
      },
      {
        id: 2,
        maxCount: 5,
        transform: [
          { posX: 0, posY: -4, posZ: 55 },
          { posX: 0, posY: -4, posZ: 45 },
        ],
      },
      {
        id: 3,
        maxCount: 5,
        transform: [
          { posX: 10, posY: -4, posZ: 55 },
          { posX: 10, posY: -4, posZ: 45 },
        ],
      },
      {
        id: 4,
        maxCount: 5,
        transform: [
          { posX: 10, posY: -4, posZ: 30 },
          { posX: 0, posY: -4, posZ: 30 },
        ],
      },
    ];

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
    this.startMonsterSpawn();
  }

  addMonster(id, monsterInfo, transform) {
    const monster = new Monster(id, monsterInfo, transform);
    this.monsterLists.push(monster);
  }

  getMonsterById(id) {
    const currentMonster = monsterLists.find((monster) => monster.id === id);

    if (!currentMonster) {
      throw new Error(`${id} 몬스터가 존재하지 않습니다.`);
    }

    return currentMonster;
  }

  sendMonsterMove(monster) {
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
    this.dungeonInstance.users.forEach((value) => {
      console.log(
        `몬스터 ID: ${monster.id} 위치 데이터 전송 - (${monster.transform.posX}, ${monster.transform.posY}, ${monster.transform.posZ})`,
      );
      value.userInfo.socket.write(response); // 데이터 전송
    });
  }

  requestPathAndMove(monster) {
    if (!monster.target) return;

    this.pathServer
      .sendPathRequest(monster.transform, monster.target.userInfo.transform)
      .then((response) => {
        // response는 S_GetNavPath 메시지에서 디코딩된 값
        const { pathPosition } = response;

        if (pathPosition) {
          // 경로의 첫 번째 점으로 이동
          monster.move(
            {
              x: pathPosition.posX,
              y: pathPosition.posY,
              z: pathPosition.posZ,
            },
            this.monsterLogicInterval,
          );
        } else {
          console.error(`몬스터 ID: ${monster.id} 경로 데이터가 없습니다.`);
        }
      })
      .catch((err) => {
        console.error(`몬스터 ID: ${monster.id} 경로 요청 실패:`, err.message || err);
      });
  }

  findClosestPlayer(monster) {
    let closestDistance = Infinity;
    let closestPlayer = null;

    this.dungeonInstance.users.forEach((value) => {
      const { posX, posY, posZ } = value.userInfo.transform;
      const distance = Math.sqrt(
        (posX - monster.transform.posX) ** 2 +
          (posY - monster.transform.posY) ** 2 +
          (posZ - monster.transform.posZ) ** 2,
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlayer = value;
      }
    });

    return closestPlayer;
  }

  getRandomMonster() {
    const monsters = getGameAssets().monster.data;
    const randomIndex = Math.floor(Math.random() * monsters.length);
    return monsters[randomIndex];
  }

  getRandomPosition(zone) {
    const randomIndex = Math.floor(Math.random() * zone.transform.length);
    return zone.transform[randomIndex];
  }

  spawnMonster(zone) {
    const monsterInfo = this.getRandomMonster();
    const transform = this.getRandomPosition(zone);

    const monsterUniqueId = this.monsterIndex++;

    const monster = new Monster(monsterUniqueId, monsterInfo, transform, zone.id);
    this.monsterLists.push(monster);

    const payload = {
      monsters: {
        monsterId: monsterUniqueId,
        monsterModel: monster.modelId,
        monsterName: monster.name,
        monsterHp: monster.maxHp,
      },

      transform,
      stats: {
        atk: monster.atk,
        def: monster.def,
        curHp: monster.curHp,
        maxHp: monster.maxHp,
        moveSpeed: monster.moveSpeed,
        criticalProbability: monster.criticalProbability,
        criticalDamageRate: monster.criticalDamageRate,
      },
    };

    this.dungeonInstance.users.forEach((user) => {
      monsterSpawnNotification(user.userInfo.socket, { payload });
    });

    // console.log(`몬스터 스폰 ${monster.name} 포지션 : ${transform.posX}, ${transform.posY}, ${transform.posZ}`)
  }

  startGameLoop() {
    // 게임 루프 시작
    this.gameLoopInterval = setInterval(() => {
      this.monsterLists.forEach((monster) => {
        // 타겟이 없을 때 가장 가까운 적을 타겟으로 설정
        if (!monster.target) {
          const closestPlayer = this.findClosestPlayer(monster);
          if (closestPlayer) {
            monster.target = closestPlayer;
            // console.log(
            //   `${monster.name}이(가) 새로운 타겟을 설정했습니다: (${closestPlayer.transform.posX}, ${closestPlayer.transform.posY}, ${closestPlayer.transform.posZ})`,
            // );
          }
        }
        // 타겟이 있을 경우 경로 요청 및 이동
        if (monster.target) {
          this.requestPathAndMove(monster);

          // 모든 유저에게 몬스터 위치 전송
          this.sendMonsterMove(monster);

          // 공격 실행
          monster.attack(this.dungeonInstance.users);
        }
      });
    }, this.monsterLogicInterval); // 0.1초마다 업데이트
  }

  stopGameLoop() {
    // 게임 루프 중지
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      console.log('게임 루프 중지됨.');
    }
  }

  startMonsterSpawn() {
    setInterval(() => {
      this.spawnZones.forEach((zone) => {
        const currentCount = this.monsterLists.filter(
          (monster) => monster.zoneId === zone.id,
        ).length;
        if (currentCount < zone.maxCount) {
          this.spawnMonster(zone);
        }
      });
    }, this.spawnInterval);
  }
}

export default MonsterLogic;
