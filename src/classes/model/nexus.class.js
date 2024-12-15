import configs from '../../configs/configs.js';
import logger from '../../utils/logger.js';

const { NEXUS_SPAWN_TRANSFORMS } = configs;

const NEXUS_HP = 3000;
const NEXUS_HP_THRESHOLD = NEXUS_HP * 0.25;

class Nexus {
  constructor() {
    this.nexusId;
    this.nexusHp = NEXUS_HP;
    this.initialHp = NEXUS_HP;
    this.lastHpThreshold = NEXUS_HP; // 마지막으로 체력 감소 임계값을 기록
    this.position = NEXUS_SPAWN_TRANSFORMS[0];
    this.isDead = false;
  }

  #getRandomSpawnNexus() {
    if (!NEXUS_SPAWN_TRANSFORMS || NEXUS_SPAWN_TRANSFORMS.length === 0) {
      logger.error('No spawn positions available');
      return;
    }

    return NEXUS_SPAWN_TRANSFORMS[Math.floor(Math.random() * NEXUS_SPAWN_TRANSFORMS.length)];
  }

  spawn() {
    this.position = this.#getRandomSpawnNexus();

    if (!this.position) {
      logger.error(`#getRandomSpawnNexus returned an invalid position.`);
    }

    logger.info(`Nexus spawned at position: ${JSON.stringify(this.position)}`);

    return this.position;
  }

  hitNexus(damage) {
    this.nexusHp = Math.max(this.nexusHp - damage, 0);

    if (this.nexusHp <= 0) {
      this.isDead = true;
      logger.info('Nexus is destroyed.');
      return this.nexusHp;
    }

    const nextThreshold = this.lastHpThreshold - NEXUS_HP_THRESHOLD; // 다음 임계값 계산

    if (this.nexusHp <= nextThreshold) {
      logger.info(`Nexus Hp dropped below ${nextThreshold}. Changing position...`);

      this.spawn();
      this.lastHpThreshold = nextThreshold; // 마지막 임계값 갱신
    }

    return this.nexusHp;
  }
}

export default Nexus;
