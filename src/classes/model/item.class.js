class Item {
    constructor(
        itemId,gold,atk,def,maxHp,criticalDamageRate,criticalProbability,curHp,moveSpeed
    ){
        this.itemId = itemId;
        this.gold = gold;
        this.atk = atk;
        this.def = def;
        this.maxHp = maxHp;
        this.criticalDamageRate = criticalDamageRate;
        this.criticalProbability = criticalProbability;
        this.curHp = curHp;
        this.moveSpeed = moveSpeed;
    }
}

export default Item;