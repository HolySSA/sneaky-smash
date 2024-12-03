import { PACKET_ID } from "../../constants/packetId.js";
import { getUserSessions } from "../../sessions/user.session.js";
import createResponse from "../../utils/response/createResponse.js";

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
        this.zoneId = zoneId;

        this.transform = {
            posX: transform.posX,
            posY: transform.posY,
            posZ: transform.posZ,
            rot: transform.rot,
        };

        this.target = null; // 현재 타겟
        this.isDead = false;
    }

    move(pathPoint) {
        if (!pathPoint && this.isDead) return;

        const directionX = pathPoint.x - this.transform.posX;
        const directionY = pathPoint.y - this.transform.posY;
        const directionZ = pathPoint.z - this.transform.posZ;

        const length = Math.sqrt(directionX ** 2 + directionY ** 2 + directionZ ** 2);

        if (length > 0) {

            this.transform.posX += (directionX / length) * this.moveSpeed;
            this.transform.posY += (directionY / length) * this.moveSpeed;
            this.transform.posZ += (directionZ / length) * this.moveSpeed;
        }
    }

    // message S_MonsterAttack {
    //   int32 monsterId = 1; // 몬스터 식별 ID
    // }

    attack(users) {
        if (!this.target && this.isDead) return;

        const distanceToTarget = Math.sqrt(
            (this.target.posX - this.transform.posX) ** 2 +
            (this.target.posY - this.transform.posY) ** 2 +
            (this.target.posZ - this.transform.posZ) ** 2
        );

        if (distanceToTarget <= this.attackRange) {
            console.log(`${this.name}이(가) ${this.target}를 공격합니다!`);          
            this.target = null; // 공격 후 타겟 초기화

            const attackPayload = {
              monsterId: this.id
            };

            const response = createResponse(PACKET_ID.S_MonsterAttack, attackPayload);
            users.forEach((value) => {
                value.socket.write(response);
            })
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
