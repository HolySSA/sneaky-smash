import Monster from './monster.class.js';
import PathServer from './pathServer.js'; // 패스파인딩 서버와 연결
import { PACKET_ID } from '../../configs/constants/packetId.js';
import createResponse from '../../utils/packet/createResponse.js';
import { getGameAssets } from '../../init/loadAsset.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import configs from '../../configs/configs.js';

const { PATH_HOST, PATH_PORT } = configs;
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
      .connectToUnityServer(PATH_HOST, PATH_PORT)
      .then(() => {
        logger.info('패스파인딩 서버에 연결되었습니다.');
      })
      .catch((err) => {
        logger.error('패스파인딩 서버 연결 실패:', err.message);
      });

    logger.info('MonsterLogic 생성됨. 게임 루프 시작.');

    this.startGameLoop();
    this.startMonsterSpawn();
  }

  addMonster(id, monsterInfo, transform) {
    const monster = new Monster(id, monsterInfo, transform);
    this.monsterLists.push(monster);
  }

  getMonsterById(id) {
    const currentMonster = this.monsterLists.find((monster) => monster.id === id);

    if (!currentMonster) {
      throw new Error(`${id} 몬스터가 존재하지 않습니다.`);
    }

    return currentMonster;
  }

  sendMonsterMove(monster) {
    const payload = {
      monsterId: monster.id,
      transform: {
        posX: monster.transform.posX,
        posY: monster.transform.posY,
        posZ: monster.transform.posZ,
        rot: 0,//monster.transform.rot, // 추가: 회전값 포함
      },
    };
    //console.log("몬스터 무브 페이로드 : ",payload);
    createNotificationPacket(PACKET_ID.S_MonsterMove, payload, this.dungeonInstance.usersUUID);
  }

  requestPathAndMove(monster) {
    if (!monster.target) return;
    
    this.pathServer
      .sendPathRequest(monster.transform, monster.target.user.transform)
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
          logger.error(`몬스터 ID: ${monster.id} 경로 데이터가 없습니다.`);
        }
      })
      .catch((err) => {
        logger.error(`몬스터 ID: ${monster.id} 경로 요청 실패:`, err.message || err);
      });
  }

  findClosestPlayer(monster) {
    let closestDistance = Infinity;
    let closestPlayer = null;

    this.dungeonInstance.users.forEach((value) => {
      //console.log("던전 인스턴스의 유저 트랜스폼 : ",value.user.transform);
      const { posX, posY, posZ, rot } = value.user.transform;
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

    createNotificationPacket(PACKET_ID.S_MonsterSpawn, payload, this.dungeonInstance.usersUUID);
    // console.log(`몬스터 스폰 ${monster.name} 포지션 : ${transform.posX}, ${transform.posY}, ${transform.posZ}`)
  }

  startGameLoop() {
    this.gameLoopInterval = setInterval(() => {
      this.monsterLists.forEach((monster) => {
        if (monster.isDead) return; // 죽은 몬스터는 처리하지 않음

        if (!monster.target || !monster.targetOn) {
          // 타겟이 없거나 비활성화 상태일 때
          const closestPlayer = this.findClosestPlayer(monster);
          if (closestPlayer) {
            const isPlayerDetected = monster.detectPlayer(closestPlayer.user.transform);
            if (isPlayerDetected) {
              // 플레이어 감지 시 활성화
              if (!monster.targetOn) {
                monster.targetOn = true;
                logger.info(`${monster.name}이(가) 플레이어를 감지했습니다.`);
              }
              monster.target = closestPlayer;
              monster.moveToTarget();
            } else {
              // 감지 범위 벗어남
              if (monster.targetOn) {
                monster.targetOn = false;
                monster.target = null;
                logger.info(`${monster.name}는 플레이어를 놓쳤습니다.`);
              }
            }
          }
        } else {
          // 타겟이 있고 활성화 상태일 때 - 이동과 공격 실행
          const isPlayerStillDetected = monster.detectPlayer(
            monster.target.user.transform,
            true, // 어그로해제됐나?
          );
          if (isPlayerStillDetected) {
            monster.attack(this.dungeonInstance.users);
            // 공격중이 아닐 때만 이동
            if (!monster.stopMove) {
              this.requestPathAndMove(monster);
              this.sendMonsterMove(monster);
            }
          } else {
            // 타겟이 감지 범위를 벗어남
            monster.targetOn = false;
            monster.target = null;
            monster.stopMove = false;
            logger.info(`${monster.name}는 플레이어를 놓쳤습니다.`);
          }
        }
      });
    }, this.monsterLogicInterval);
  }

  stopGameLoop() {
    // 게임 루프 중지
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
      logger.info('게임 루프 중지됨.');
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
