import { PACKET_ID } from '../../configs/constants/packetId.js';
import createResponse from '../../utils/packet/createResponse.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
class Monster {
  #cannotReachCount = 0;
  constructor(id, monster, transform, zoneId) {
    this.id = id;
    this.modelId = monster.id;
    this.name = monster.name;
    this.maxHp = monster.maxHp;
    this.curHp = this.maxHp;
    this.atk = monster.atk;
    this.def = monster.def;
    this.criticalProbability = monster.criticalProbability;
    this.criticalDamageRate = monster.criticalDamageRate;
    this.moveSpeed = monster.moveSpeed;
    this.attackSpeed = monster.attackSpeed;
    this.attackRange = monster.attackRange || 1.5;
    this.lastAttackTime = 0;
    this.detectRange = 7.0; // 인지범위
    this.releaseRange = 20.0; // 어그로 해제 범위
    this.zoneId = zoneId;

    this.transform = {
      posX: transform.posX,
      posY: transform.posY,
      posZ: transform.posZ,
      rot: transform.rot,
    };

    this.stopMove = false; // 공격할 때 이동을 멈춰라 그것이 예.의니까...
    this.targetOn = false; //SIW
    this.target = null; // 현재 타겟
    this.isDead = false;
  }

  move(pathPoint, monsterLogicInterval) {
    if (!pathPoint && this.isDead) return;

    if (pathPoint.rot) {
      this.#cannotReachCount += monsterLogicInterval;
      if (this.#cannotReachCount > 5000) {
        this.#cannotReachCount = 0;
        this.transform = structuredClone(this.target.user.transform);
      }
    }
    const directionX = pathPoint.posX - this.transform.posX;
    const directionY = pathPoint.posY - this.transform.posY;
    const directionZ = pathPoint.posZ - this.transform.posZ;

    const length = Math.sqrt(directionX ** 2 + directionY ** 2 + directionZ ** 2);
    const moveFactor = monsterLogicInterval * 0.001 * this.moveSpeed;
    if (length > 0) {
      this.transform.posX += (directionX / length) * moveFactor;
      // this.transform.posY +=
      //   (directionY / length) * this.moveSpeed * (monsterLogicInterval * 0.001);
      this.transform.posY = pathPoint.posY;
      this.transform.posZ += (directionZ / length) * moveFactor;
    }
  }

  // message S_MonsterAttack {
  //   int32 monsterId = 1; // 몬스터 식별 ID
  // }

  //거리계산
  calculateDistance(targetTransform) {
    const dx = this.transform.posX - targetTransform.posX;
    const dy = this.transform.posY - targetTransform.posY;
    const dz = this.transform.posZ - targetTransform.posZ;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  //플레이어 감지
  detectPlayer(playerTransform, releaseCheck = false) {
    const distance = this.calculateDistance(playerTransform);
    // releaseCheck true면 releaseRange를, false면 detectRange를 사용
    return distance <= (releaseCheck ? this.releaseRange : this.detectRange);
  }

  attack(dungeonInstance) {
    if (!this.target && this.isDead) return;

    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;
    const attackDelay = 1000 / this.attackSpeed; // attackSpeed를 초당 공격 횟수로 변환

    // 아직 공격 딜레이가 끝나지 않았으면 리턴
    if (timeSinceLastAttack < attackDelay) {
      return;
    }
    //공격대상이없다면 공격자를 죽이러간다
    if (!this.target) {
      return;
    }
    if(this.target.user.currentHp <= 0){
      this.target = null;
      return;
    }

    const distanceToTarget = Math.sqrt(
      (this.target.user.transform.posX - this.transform.posX) ** 2 +
        (this.target.user.transform.posY - this.transform.posY) ** 2 +
        (this.target.user.transform.posZ - this.transform.posZ) ** 2,
    );

    if (distanceToTarget <= this.attackRange) {
      this.stopMove = true;
      logger.info(`${this.name}이(가) ${this.target}를 공격합니다!`);
      this.target = null; // 공격 후 타겟 초기화

      const attackPayload = {
        monsterId: this.id,
      };

      createNotificationPacket(PACKET_ID.S_MonsterAttack, attackPayload, dungeonInstance.usersUUID);

      // 공격 시간 갱신
      this.lastAttackTime = currentTime;
    } else {
      this.stopMove = false;
    }
  }

  death() {
    this.curHp <= 0;
    this.isDead = true;
    const dropRate = Math.random();
    if (dropRate < 0.2) {
      return Math.floor(Math.random() * 20) + 100;
    }
    return 0;
  }

  hit(damage, targetYou) {
    if (this.isDead) return;
    this.curHp -= Math.max(0, damage - this.def); // 방어력이 공격력보다 커도 최소뎀

    // 공격자를 타겟으로 설정
    if (!this.target) {
      this.target = targetYou; // 공격자가 타겟으로 설정됨
      this.targetOn = true; // 타겟 활성화
    }

    return this.curHp;
  }
}

export default Monster;
