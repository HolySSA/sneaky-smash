class Monster{
    constructor(id, name, hp, position, atk, def, criticalProbability, criticalDamageRate, moveSpeed, attackSpeed){
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.position = position;
        this.atk = atk;
        this.def = def;
        this.criticalProbability = criticalProbability;
        this.criticalDamageRate = criticalDamageRate;
        this.moveSpeed = moveSpeed;
        this.attackSpeed = attackSpeed;
    }
}

export default Monster;