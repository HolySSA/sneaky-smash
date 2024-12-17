import Monster from './monster.class.js';
import PathServer from './pathServer.js'; // 패스파인딩 서버와 연결
import { PACKET_ID } from '../../configs/constants/packetId.js';
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
    this.spawnInterval = 1000 * 30; // 30초
    this.spawnZones = [
      {
        id: 1,
        maxMonsterCount: 5,
        transform: [
          { posX: -5, posY: -4.6, posZ: 75 },
          { posX: 5, posY: -4.6, posZ: 75 },
        ],
      },
      {
        id: 2,
        maxMonsterCount: 5,
        transform: [
          { posX: 0, posY: -4.6, posZ: 55 },
          { posX: 0, posY: -4.6, posZ: 45 },
        ],
      },
      {
        id: 3,
        maxMonsterCount: 5,
        transform: [
          { posX: 10, posY: -4.6, posZ: 55 },
          { posX: 10, posY: -4.6, posZ: 45 },
        ],
      },
      {
        id: 4,
        maxMonsterCount: 5,
        transform: [
          { posX: 10, posY: -4.6, posZ: 30 },
          { posX: 0, posY: -4.6, posZ: 30 },
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
      logger.error('몬스터가 존재하지 않습니다');
      return null;
    }

    return currentMonster;
  }

  /**
   *  몬스터 사망시 호출하는 함수
   * @param {Number} monsterId
   * @returns
   */
  destroyMonsterById(monsterId) {
    const index = this.monsterLists.findIndex((monster) => monster.id == monsterId);
    if (index === -1) {
      logger.error(`destroyMonsterById. could not found monster : ${monsterId}`);
      return null;
    }
    this.monsterLists.splice(index, 1);
  }

  sendMonsterMove(monster) {
    const payload = {
      monsterId: monster.id,
      transform: {
        posX: monster.transform.posX,
        posY: monster.transform.posY,
        posZ: monster.transform.posZ,
        rot: 0,
      },
    };
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
          monster.move(pathPosition, this.monsterLogicInterval);
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

    for (const value of this.dungeonInstance.users.values()) {
      if (value.currentHp <= 0) continue;

      const { posX, posY, posZ, rot } = value.user.transform;
      const distance = Math.sqrt(
        (posX - monster.transform.posX) ** 2 +
          (posY - monster.transform.posY) ** 2 +
          (posZ - monster.transform.posZ) ** 2,
      );

      if (distance < closestDistance && value.currentHp > 0) {
        closestDistance = distance;
        closestPlayer = value;        
      }
    }

    return closestPlayer;
  }

  getRandomMonster() {
    const monsterAssets = getGameAssets().monster; // 몬스터 데이터 가져오기
    const monsterId = Math.floor(Math.random() * monsterAssets.length); // 랜덤 몬스터 아이디
    return monsterAssets[monsterId];
  }

  getRandomPosition(zone, radius) {
    // 랜덤하게 선택된 transform의 중심 좌표 가져오기
    const randomIndex = Math.floor(Math.random() * zone.transform.length);
    const { posX, posY, posZ } = zone.transform[randomIndex];

    // 랜덤 각도 (0 ~ 2π 사이) 생성
    const angle = Math.random() * 2 * Math.PI;

    // 원형 범위 내 랜덤 좌표 계산 (x, z)
    const randomX = posX + Math.cos(angle) * radius;
    const randomZ = posZ + Math.sin(angle) * radius;

    // 결과 반환 (y는 고정)
    return { posX: randomX, posY, posZ: randomZ };
  }
  spawnMonster(zone) {
    const monsterInfo = this.getRandomMonster(); // 몬스터 정보
    const transform = this.getRandomPosition(zone, 1.5);

    const monsterUniqueId = this.monsterIndex++;

    const elapsedTime = (Date.now() - this.dungeonInstance.startTime) / 1000; // 시작 이후 경과
    let multiplier = 1 + Math.floor(elapsedTime / 30) * 0.2; // 30초마다 50% 증가
    multiplier += this.dungeonInstance.dungeonLevelFactor; //난이도에 따라 추가 스탯 증가
    // 증가된 스탯 적용
    const boostedMonsterInfo = {
      ...monsterInfo,
      maxHp: Math.floor(monsterInfo.maxHp * multiplier),
      atk: Math.floor(monsterInfo.atk * multiplier),
      def: Math.floor(monsterInfo.def * multiplier),
      criticalProbability: monsterInfo.criticalProbability * multiplier,
      criticalDamageRate: monsterInfo.criticalDamageRate * multiplier,
      moveSpeed: monsterInfo.moveSpeed, // 이동 속도는 고정
      attackSpeed: monsterInfo.attackSpeed, // 공격 속도는 고정
    };

    const monster = new Monster(monsterUniqueId, boostedMonsterInfo, transform, zone.id);
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
              createNotificationPacket(PACKET_ID.S_SetMonsterTarget, { monsterId: monster.id, playerId: closestPlayer.id }, this.dungeonInstance.usersUUID);
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
            monster.attack(this.dungeonInstance);

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

  stopMonsterSpawn() {
    if (this.monsterSpawnInterval) {
      clearInterval(this.monsterSpawnInterval);
      this.monsterSpawnInterval = null;
      logger.info('stopped MonsterSpawn');
    }
  }

  startMonsterSpawn() {
    // 30초마다 몬스터 스폰
    this.monsterSpawnInterval = setInterval(() => {
      this.spawnMonsterZone();
    }, this.spawnInterval);
  }

  spawnMonsterZone() {
    this.spawnZones.forEach((zone) => {
      const currentMonsterCount = this.monsterLists.filter(
        (monster) => monster.zoneId === zone.id,
      ).length;
      if (currentMonsterCount < zone.maxMonsterCount) {
        this.spawnMonster(zone);
      }
    });
  }

  Dispose() {
    this.pathServer.onClose();
    this.stopGameLoop();
    this.stopMonsterSpawn();
    this.dungeonInstance = null;
    logger.info(`MonsterLogic disposed`);
  }
}

export default MonsterLogic;
