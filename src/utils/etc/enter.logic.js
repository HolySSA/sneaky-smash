import { PACKET_ID } from '../../constants/packetId.js';
import { getRedisUsers } from '../../sessions/redis/redis.user.js';
import { getUserSessions, getUserTransformById } from '../../sessions/user.session.js';
import createNotificationPacket from '../notification/createNotification.js';
import decodeMessageByPacketId from '../parser/decodePacket.js';
import createResponse from '../response/createResponse.js';

const enterLogic = async (socket, userSession) => {
  try {
    // 현재 유저의 데이터를 구성 (다른 유저들에게 알릴 정보)
    const currentUserPayload = {
      playerId: userSession.id, // 유저 ID
      nickname: userSession.nickname, // 닉네임
      class: userSession.myClass, // 유저 클래스
      transform: getUserTransformById(userSession.id), // 유저 위치 정보
    };

    console.log(currentUserPayload);

    // 현재 유저에게 자신의 입장 정보를 전달
    const response = createResponse(PACKET_ID.S_Enter, { player: currentUserPayload });
    socket.write(response); // 소켓으로 패킷 전송

    const users = await getRedisUsers();
    const userSessions = getUserSessions();

    const entryNotification = createNotificationPacket(PACKET_ID.S_Spawn, { players: [currentUserPayload]});

    for (const [sessionId, sessionData] of userSessions) {

      if (sessionId !== userSession.id) {
        sessionData.socket.write(entryNotification);
      }
    }

    const otherUsersPayload = {
      players: users
        .filter((player) => player.id !== userSession.id) // 현재 유저 제외
        .map((player) => ({
          playerId: player.id, // 다른 유저 ID
          nickname: player.nickname, // 다른 유저 닉네임
          class: player.myClass, // 다른 유저 클래스
          transform: getUserTransformById(player.id), // 다른 유저 위치 정보
        })),
    };

    // 현재 유저에게 다른 유저 정보 알림 패킷 전송

    if(otherUsersPayload.players.length === 0)
      return;

    const otherUsersNotification = createNotificationPacket(PACKET_ID.S_Spawn, otherUsersPayload);
    socket.write(otherUsersNotification);
  } catch (error) {
    console.error('Error in enterLogic:', error); // 에러 발생 시 로그 출력
  }
};

export default enterLogic;
