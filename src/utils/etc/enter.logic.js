import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisUsers } from '../../sessions/redis/redis.user.js';
import { getUserSessions, getUserTransformById } from '../../sessions/user.session.js';
import createNotificationPacket from '../notification/createNotification.js';
import decodeMessageByPacketId from '../parser/decodePacket.js';
import createResponse from '../response/createResponse.js';

// message S_Enter {
//     PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

const enterLogic = async (socket, user) => {
  try {
    const playerPayload = {
      playerId: user.id,
      nickname: user.nickname,
      class: user.myClass,
      transform: getUserTransformById(user.id),
    };

    const response = createResponse(PACKET_ID.S_Enter, { player: playerPayload });
    socket.write(response);

    const users = await getRedisUsers();
    const userSessions = getUserSessions();

    const entryNotification = createNotificationPacket(PACKET_ID.S_Spawn, { players: [currentUserPayload]});

    for (const [sessionId, sessionData] of userSessions) {
      if (sessionId !== user.id) {
        sessionData.socket.write(entryNotification);
      }
    }

    const otherUsersPayload = {
      players: users
        .filter((player) => player.id !== user.id) // 현재 유저 제외
        .map((player) => ({
          playerId: parseInt(player.id),
          nickname: player.nickname,
          class: parseInt(player.myClass),
          transform: getUserTransformById(parseInt(player.id)),
        })),
    };

    if(otherUsersPayload.players.length === 0)
      return;

    const otherUsersNotification = createNotificationPacket(PACKET_ID.S_Spawn, otherUsersPayload);
    socket.write(otherUsersNotification);
  } catch (error) {
    console.error('Error in enterLogic:', error); // 에러 발생 시 로그 출력
  }
};

export default enterLogic;
