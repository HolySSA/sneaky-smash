import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import logger from '../../utils/logger.js';
import broadcastBySession from '../../utils/notification/broadcastBySession.js';

// notification
const shootProjectileHandler = async ({ socket, payload }) => {
  const { projectileId, transform, dir } = payload;
  const playerId = socket.id;

  try {
    const projectileAssets = getGameAssets().projectile; // 맵핑된 Projectile 데이터 가져오기
    const projectileInfo = projectileAssets[projectileId]; // ID로 직접 접근

    if (!projectileInfo) {
      logger.error(`Projectile 정보를 찾을 수 없습니다. projectileId: ${projectileId}`);
      return;
    }

    const shootProjectilePayload = {
      playerId,
      projectileId,
      transform,
      dir,
      projectileSpeed: projectileInfo.projectileSpeed,
    };

    broadcastBySession(socket, PACKET_ID.S_ShootProjectile, shootProjectilePayload);
  } catch (err) {
    handleError(socket, err);
  }
};

export default shootProjectileHandler;
