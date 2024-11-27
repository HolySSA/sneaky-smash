class Monster {
  constructor(
    id,
    modelId,
    name,
    hp,
    atk,
    def,
    criticalProbability,
    criticalDamageRate,
    moveSpeed,
    attackSpeed,
  ) {
    this.id = id;
    this.modelId = modelId;
    this.name = name;
    this.hp = hp;

    this.transform = {
      posX: 0,
      posY: 0,
      posZ: 0,
      rot: 0,
    };

    this.atk = atk;
    this.def = def;
    this.criticalProbability = criticalProbability;
    this.criticalDamageRate = criticalDamageRate;
    this.moveSpeed = moveSpeed;
    this.attackSpeed = attackSpeed;
  }
}

export default Monster;
