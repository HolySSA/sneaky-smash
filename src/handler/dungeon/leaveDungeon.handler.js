import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getUserById } from '../../sessions/user.session.js';
import { addUserForTown } from '../../sessions/town.session.js';
import logger from '../../utils/logger.js';

import spawnPlayerTown from '../../utils/etc/enterTown.js';
import configs from '../../configs/configs.js';

const { TOWN_SPAWN_TRANSFORMS } = configs;

const leaveDungeonHandler = async ({ socket, payload }) => {
  const playerId = socket.id;
  try {
    // 유저 세션에 있는 유저 정보 가져오고
    const user = getUserById(playerId);
    if (!user) {
      logger.error('leaveDungeonHandler: Cannot find user.');
      return;
    }
    // 던전 아이디 가져오고
    const dungeonId = user.dungeonId;
    // 해당 유저가 있던 던전 불러오고
    // 해당 유저 던전아이디 빈값으로
    user.dungeonId = '';
    const dungeon = getDungeonSession(dungeonId);
    if (dungeon) {
      // 타운에 유저 추가
      const playerPayload = {
        player: {
          playerId: socket.id,
          nickname: user.nickname,
          class: user.myClass,
          transform: TOWN_SPAWN_TRANSFORMS,
        },
      };

      await dungeon.removeDungeonUser(playerId);

      spawnPlayerTown(socket, user, playerPayload);
      // 타운에 있는 유저 UUID 목록 호출
      const dungeonUUID = dungeon.getDungeonUsersUUID();

      createNotificationPacket(PACKET_ID.S_LeaveDungeon, { playerId }, dungeonUUID);
    } else {
      logger.error(
        `leaveDungeonHandler. dungeon is undefined : ${dungeon} / User => ${playerId} / DungeonId : ${dungeonId}`,
      );
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveDungeonHandler;
