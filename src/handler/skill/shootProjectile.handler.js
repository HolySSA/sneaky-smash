import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getGameAssets } from '../../init/loadAsset.js';
import { getRedisUserById } from '../../sessions/redis/redis.user.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';

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

const shootProjectileHandler = async (socket, payload) => {
  try {
    const { projectileId, transform, dir } = payload;

    const projectileInfo = getGameAssets().projectile.data;

    const shootProjectilePayload = {
        playerId,
        projectileId,
        transform,
        dir,
        projectileSpeed: projectileInfo.projectileSpeed,
    };
    
    const response = createResponse(PACKET_ID.S_ShootProjectile, shootProjectilePayload);

    const redisUser = await getRedisUserById(socket.id);
    const dungeon = getDungeonSession(redisUser.sessionId);

    const allUsers = dungeon.getAllUsers();
    
    allUsers.forEach((value) => {
        value.socket.write(response);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default shootProjectileHandler;
