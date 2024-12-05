import { PACKET_ID } from '../../constants/packetId.js';
import createResponse from '../../utils/response/createResponse.js';

class Monster {
  constructor(id, monster, transform, zoneId) {
    this.id = id;
    this.modelId = monster.monsterId;
    this.name = monster.name;
    this.maxHp = monster.MaxHp;
    this.curHp = this.maxHp;
    this.atk = monster.ATK;
    this.def = monster.DEF;
    this.criticalProbability = monster.CriticalProbability;
    this.criticalDamageRate = monster.CriticalDamageRate;
    this.moveSpeed = monster.MoveSpeed;
    this.attackSpeed = monster.attackSpeed;
    this.attackRange = monster.AttackRange || 1.5;
    this.lastAttackTime = 0;
    this.detectRange = 5.0; //SIW
    this.zoneId = zoneId;

    this.transform = {
      posX: transform.posX,
      posY: transform.posY,
      posZ: transform.posZ,
      rot: transform.rot,
    };

    this.targetOn = false; //SIW
    this.target = null; // 현재 타겟
    this.isDead = false;
  }

  move(pathPoint, monsterLogicInterval) {
    if (!pathPoint && this.isDead) return;

    const directionX = pathPoint.x - this.transform.posX;
    const directionY = pathPoint.y - this.transform.posY;
    const directionZ = pathPoint.z - this.transform.posZ;

    const length = Math.sqrt(directionX ** 2 + directionY ** 2 + directionZ ** 2);

    if (length > 0) {
      this.transform.posX +=
        (directionX / length) * this.moveSpeed * (monsterLogicInterval * 0.001);
      this.transform.posY +=
        (directionY / length) * this.moveSpeed * (monsterLogicInterval * 0.001);
      this.transform.posZ +=
        (directionZ / length) * this.moveSpeed * (monsterLogicInterval * 0.001);
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
  detectPlayer(playerTransform) {
    const distance = this.calculateDistance(playerTransform);
    return distance <= this.detectRange;
  }

  attack(users) {
    if (!this.target && this.isDead) return;

    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;
    const attackDelay = 1000 / this.attackSpeed; // attackSpeed를 초당 공격 횟수로 변환

    // 아직 공격 딜레이가 끝나지 않았으면 리턴
    if (timeSinceLastAttack < attackDelay) {
      return;
    }
    const distanceToTarget = Math.sqrt(
      (this.target.userInfo.transform.posX - this.transform.posX) ** 2 +
        (this.target.userInfo.transform.posY - this.transform.posY) ** 2 +
        (this.target.userInfo.transform.posZ - this.transform.posZ) ** 2,
    );

    if (distanceToTarget <= this.attackRange) {
      console.log(`${this.name}이(가) ${this.target}를 공격합니다!`);
      this.target = null; // 공격 후 타겟 초기화

      const attackPayload = {
        monsterId: this.id,
      };

      const response = createResponse(PACKET_ID.S_MonsterAttack, attackPayload);
      users.forEach((value) => {
        value.userInfo.socket.write(response);
      });
      // 공격 시간 갱신
      this.lastAttackTime = currentTime;
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

  hit(damage) {
    if (this.isDead) return;
    this.curHp -= Math.max(0, damage - this.def); // 방어력이 공격력보다 커도 최소뎀

    return this.curHp;
  }
}

export default Monster;
