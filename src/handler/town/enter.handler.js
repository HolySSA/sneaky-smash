import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getAllUsers } from '../../utils/redis/user.session.js';
// 패킷명세
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }
// message C_Enter {
//   string nickname = 1;        // 닉네임
//   int32 class = 2;            // 캐릭터 클래스
// }
// message S_Enter {
//   PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }
// **StatInfo** - 플레이어의 상세 스탯 정보

const enterHandler = async (socket, payload) => {
  try {
    const { nickname, myClass } = payload;

    const enterPayload = {
      player: {
        playerId: socket.id,
        nickName,
        myClass,
      },
    };

    const response = createResponse(PACKET_ID.S_Enter, enterPayload);
    socket.write(response);

    // 여기는 다른 유저들 전부 알려주기

    // 레디스에서 모든 유저를 불러옵니다.
    const allUsers = await getAllUsers();
    // notification 페이로드를 만듭니다.

    /*
    await redis.hmset(userKey, {
      playerId: user.id,
      nickName: user.nickName,
      socket: socket
    });
     */
    const spawnPayload = {
      players: allUsers.map((user) => ({
        playerId: user.id,
        nickName: user.nickName,
        myClass: user.myClass,
      })),
    };

    // 모든 유저에게 보낼 notification
    const notification = createNotificationPacket(PACKET_ID.S_Spawn, spawnPayload);

    // 모든 유저의 소켓에 notification 패킷을 던집니다.
    allUsers.forEach((user) => {
      user.socket.write(notification);
    });
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterHandler;
