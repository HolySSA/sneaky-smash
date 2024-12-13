import { PACKET_ID } from '../../configs/constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { getDungeonSession } from '../../sessions/dungeon.session.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getUserById } from '../../sessions/user.session.js';
import { addUserForTown, getAllUserByTown } from '../../sessions/town.session.js';
import logger from '../../utils/logger.js';

// message C_LeaveDungeon {
//   // 던전에서 나가기 요청
// }

// 패킷명세
// 던전에서 나가는 응답 (S_LeaveDungeon)
// message S_LeaveDungeon {
//     int32 playerId = 1;          // 던전에서 나간 플레이어 ID
//   }

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
    const dungeon = getDungeonSession(dungeonId);
    // 해당 유저 던전아이디 빈값으로
    user.dungeonId = '';
    // 타운에 유저 추가
    addUserForTown(user);
    // 타운에 있는 유저 UUID 목록 호출
    const townUsersUUID = getAllUserByTown();

    // 던전에서 유저 제거
    if (!dungeon.removeDungeonUser(playerId)) {
      logger.error(`leaveDungeonHandler: 해당 던전에서 ${playerId} 유저 제거 실패.`);
      return;
    }

    // 던전에 마지막 유저가 제거 되었다면
    if (dungeon.isRemainedUser()) {
      logger.info(
        `dungeonId: ${dungeonId} 던전에 남아 있던 마지막 유저 ${playerId}가 던전을 떠났고 던전은 닫혔습니다.`,
      );
    }

    createNotificationPacket(PACKET_ID.S_LeaveDungeon, { playerId }, townUsersUUID);
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveDungeonHandler;
