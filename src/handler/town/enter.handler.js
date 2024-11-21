import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getAllUsers, getUserSessions } from '../../utils/redis/user.session.js';
import { addUser } from '../../utils/redis/user.session.js';
import { addCharacter, findCharacterByUserId } from '../../db/character/characters.db.js';

const enterHandler = async (socket, payload) => {
  try {
    // 아직 접속하지 않아서 redis에 저장되어 있지 않음.
    const user = await addUser(socket, socket.id, payload.class, payload.nickname);

    // 캐릭터 생성 로직
    let character = await findCharacterByUserId(socket.id);
    if (character) {
      return;
    }

    // sql 에서 gold default 선언해서 만들면 gold 입력 빼기 가능
    character = await addCharacter(user.id, user.nickname, user.myClass, 0);

    const player = {
      playerId: user.id,
      nickname: user.nickname,
      class: user.myClass,
    };

    const enterPayload = {
      player,
    };

    const response = createResponse(PACKET_ID.S_Enter, enterPayload);
    socket.write(response);

    // 여기는 다른 유저들 전부 알려주기

    const allUsers = await getAllUsers();

    const spawnPayload = {
      players: allUsers.map((user) => ({
        playerId: user.id,
        nickname: user.nickname,
        class: user.myClass,
      })),
    };

    // 모든 유저에게 보낼 notification
    const notification = createNotificationPacket(PACKET_ID.S_Spawn, spawnPayload);

    const users = await getUserSessions();

    // 모든 유저의 소켓에 notification 패킷을 던집니다.
    users.forEach((user) => {
      user.socket.write(notification);
    });
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterHandler;
