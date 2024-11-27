class Boss {
  constructor(
    id,
    name,
    hp,
    transform,
    atk,
    def,
    criticalProbability,
    criticalDamageRate,
    moveSpeed,
    attackSpeed,
  ) {
    this.id = id;
    this.name = name;
    this.hp = hp;
    this.transform = transform;
    this.atk = atk;
    this.def = def;
    this.criticalProbability = criticalProbability;
    this.criticalDamageRate = criticalDamageRate;
    this.moveSpeed = moveSpeed;
    this.attackSpeed = attackSpeed;
  }
}

export default Boss;
