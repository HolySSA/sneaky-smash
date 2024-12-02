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

  death() {}

  hit() {}
}

export default Monster;
