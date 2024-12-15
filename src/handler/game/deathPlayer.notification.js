import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getGameAssets } from '../../init/loadAsset.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import logger from '../../utils/logger.js';

// message S_DeathPlayer { ★
//     int32 playerId = 1;
//     float spawnTime = 2;
//     }

const deathPlayerNotification = (playerId, userLevel, dungeonUsersUUID) => {
    const spawnTimeAssets = getGameAssets().spawnTimeInfo;
    let spawnTime = spawnTimeAssets[userLevel].spawnTime;

    if(!spawnTime)
    {
      logger.info("spawnTime이 존재하지 않습니다");
      spawnTime = spawnTimeAssets[spawnTimeAssets.length].spawnTime;
    }

    createNotificationPacket(PACKET_ID.S_DeathPlayer, { playerId, spawnTime }, dungeonUsersUUID);
};

export default deathPlayerNotification;
