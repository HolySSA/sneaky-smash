import configs from '../../configs/configs.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import generateNexusId from '../../utils/generateNexusId.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const { NEXUS_SPAWN_TRANSFORMS } = configs;

const NEXUS_HP = 3000;
const NEXUS_HP_THRESHOLD = NEXUS_HP * 0.25;

const REGEN_DELAY = 20 * 1000;
const REGEN_PERCENT = 0.01;
const REGEN_NEXUS_HP_PER_TIME = 1000;

class Nexus {
  constructor() {
    this.nexusId = generateNexusId();
    this.nexusHp = NEXUS_HP;
    this.initialHp = NEXUS_HP;
    this.lastHpThreshold = NEXUS_HP; // 마지막으로 체력 감소 임계값을 기록
    this.position = NEXUS_SPAWN_TRANSFORMS[0];
    this.isDead = false;
    this.lastAttackerId = null;

    // 체력 회복 타이머
    this.regenerationTimer = null;
    this.regenerationInterval = null;
  }

  #clearTimer() {
    if (this.regenerationTimer) {
      clearInterval(this.regenerationTimer);
      this.regenerationTimer = null;
    }

    if (this.regenerationInterval) {
      clearInterval(this.regenerationInterval);
      this.regenerationInterval = null;
    }
  }

  resetRegenerationTimer(usersUUID) {
    this.#clearTimer();

    this.regenerationTimer = setTimeout(() => {
      this.startRegeneration(usersUUID);
    }, REGEN_DELAY);
  }

  startRegeneration(usersUUID) {
    this.regenerationInterval = setInterval(() => {
      if (this.isDead || this.nexusHp >= this.initialHp) {
        this.#clearTimer();
        return;
      }

      const regenAmount = Math.floor(this.initialHp * REGEN_PERCENT);
      this.nexusHp = Math.min(this.nexusHp + regenAmount, this.initialHp);

      logger.info(`Nexus 체력 회복 중: ${this.nexusHp}/${this.initialHp}`);
      this.updateNexusHpNotification(usersUUID);
    }, REGEN_NEXUS_HP_PER_TIME);
  }

  #getRandomSpawnNexus() {
    if (!NEXUS_SPAWN_TRANSFORMS || NEXUS_SPAWN_TRANSFORMS.length === 0) {
      logger.error('No spawn positions available');
      return null;
    }

    return NEXUS_SPAWN_TRANSFORMS[Math.floor(Math.random() * NEXUS_SPAWN_TRANSFORMS.length)];
  }

  spawn(usersUUID) {
    const newPosition = this.#getRandomSpawnNexus();

    if (!newPosition) {
      logger.error(`#getRandomSpawnNexus returned an invalid position.`);
      return false;
    }

    this.position = newPosition;
    logger.info(`Nexus spawned at position: ${JSON.stringify(this.position)}`);

    this.spawnNexusNotification(usersUUID);
    return true;
  }

  hitNexus(damage, playerId, usersUUID) {
    if (this.isDead) {
      logger.warn('Nexus is already destroyed. No further damage applied.');
      return this.isDead;
    }

    this.nexusHp = Math.max(this.nexusHp - damage, 0);
    this.lastAttackerId = playerId;

    this.resetRegenerationTimer(usersUUID);

    if (this.nexusHp <= 0) {
      this.isDead = true;
      logger.info('Nexus is destroyed.');
      this.updateNexusHpNotification(usersUUID);
      return this.isDead;
    }

    const nextThreshold = this.lastHpThreshold - NEXUS_HP_THRESHOLD; // 다음 임계값 계산

    if (this.nexusHp <= nextThreshold) {
      logger.info(`Nexus Hp dropped below ${nextThreshold}. Changing position...`);

      if (this.spawn(usersUUID)) {
        this.lastHpThreshold = nextThreshold;
      }
    }

    this.updateNexusHpNotification(usersUUID);
    return this.isDead;
  }

  spawnNexusNotification(usersUUID) {
    createNotificationPacket(
      PACKET_ID.S_NexusSpawn,
      { nexusId: this.nexusId, transform: this.position },
      usersUUID,
    );
  }

  updateNexusHpNotification(usersUUID) {
    createNotificationPacket(PACKET_ID.S_UpdateNexusHp, { hp: this.nexusHp }, usersUUID);
  }

  Dispose() {
    this.#clearTimer();

    logger.info('Nexus 리소스가 정리되었습니다.');
  }
}

export default Nexus;
