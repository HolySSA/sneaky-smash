import configs from '../../configs/configs.js';
import { PACKET_ID } from '../../configs/constants/packetId.js';
import generateNexusId from '../../utils/generateNexusId.js';
import logger from '../../utils/logger.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const { NEXUS_SPAWN_TRANSFORMS } = configs;

const NEXUS_HP = 3000;
const NEXUS_HP_THRESHOLD = NEXUS_HP * 0.25;

class Nexus {
  constructor() {
    this.nexusId = generateNexusId();
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

  spawn(usersUUID) {
    const newPosition = this.#getRandomSpawnNexus();

    if (!newPosition) {
      logger.error(`#getRandomSpawnNexus returned an invalid position.`);
      return false;
    }

    this.position = newPosition; // 새 위치 설정
    logger.info(`Nexus spawned at position: ${JSON.stringify(this.position)}`);

    this.spawnNexusNotification(usersUUID);
    return true;
  }

  hitNexus(damage, usersUUID) {
    if (this.isDead) {
      logger.warn('Nexus is already destroyed. No further damage applied.');
      return this.isDead;
    }

    this.nexusHp = Math.max(this.nexusHp - damage, 0);

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
}

export default Nexus;
