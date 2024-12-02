class Monster {
  constructor(id, monster) {
    this.id = id;
    this.modelId = monster.id;
    this.name = monster.name;
    this.maxHp = monster.MaxHp;
    this.curHp = this.maxHp;
    this.atk = monster.ATK;
    this.def = monster.DEF;
    this.criticalProbability = monster.CriticalProbability;
    this.criticalDamageRate = monster.CriticalDamageRate;
    this.moveSpeed = monster.MoveSpeed;
    this.attackSpeed = monster.attackSpeed;
    this.isDead = false;

    this.transform = {
      posX: 0,
      posY: 0,
      posZ: 0,
      rot: 0,
    };
  }

  idle() {}

  move(vertices) {
    const directionX = vertices.x - this.transform.posX;
    const directionY = vertices.y - this.transform.posY;
    const directionZ = vertices.z - this.transform.posZ;

    const length = Math.sqrt(directionX ** 2 + directionY ** 2 + directionZ ** 2);

    if (length > 0) {
      this.transform.posX += (directionX / length) * this.moveSpeed;
      this.transform.posY += (directionY / length) * this.moveSpeed;
      this.transform.posZ += (directionZ / length) * this.moveSpeed;
    }
  }

  attack() {}

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
    this.curHp -= Math.max(0, damage - this.def); // 방어력이 공격력보다 커도 최소뎀 0
    if (this.curHp <= 0) {
      return this.death();
    }
    return 0;
  }
}

export default Monster;
