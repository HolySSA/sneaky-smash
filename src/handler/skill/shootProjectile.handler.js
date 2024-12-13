import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getDungeonSession, getDungeonUsersUUID } from '../../sessions/dungeon.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { findCharacterByUserId } from '../../db/model/characters.db.js';
import logger from '../../utils/logger.js';

// notification
const shootProjectileHandler = async ({ socket, payload }) => {
  const { projectileId, transform, dir } = payload;
  const playerId = socket.id;

  try {
    const redisUser = await findCharacterByUserId(socket.id);
    const dungeonUsersUUID = getDungeonUsersUUID(redisUser.sessionId);

    const projectileInfo = getGameAssets().projectile.data.find(
      (projectile) => projectile.projectileId === projectileId,
    );
    if (!projectileInfo) {
      logger.error(`Projectile with ID ${projectileId} not found in projectile.data.`);
      return;
    }

    const shootProjectilePayload = {
      playerId,
      projectileId,
      transform,
      dir,
      projectileSpeed: projectileInfo.projectileSpeed,
    };

    createNotificationPacket(PACKET_ID.S_ShootProjectile, shootProjectilePayload, dungeonUsersUUID);
  } catch (err) {
    handleError(socket, err);
  }
};

export default shootProjectileHandler;

// message TransformInfo {
//     float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//     float posY = 2;   // Y 좌표 (기본값 : 1)
//     float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//     float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
//   }

// message C_ShootProjectile {
// 	int32 projectileId = 1;
//  TransformInfo transform = 2;
// 	ProjectileDirection dir = 3;
// }

// message S_ShootProjectile {
// 	int32 playerId = 1;
//  int32 projectileId = 2;
//  TransformInfo transform = 3;
// 	ProjectileDirection dir = 4;
//  float projectileSpeed = 5;
// }
