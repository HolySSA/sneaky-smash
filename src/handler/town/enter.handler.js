import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';
import { getAllUsers } from '../../utils/redis/user.session.js';
import { addUser } from '../../utils/redis/user.session.js';
import { v4 as uuidv4 } from 'uuid';

const enterHandler = async (socket, payload) => {
  try {
    const user = await addUser(socket, uuidv4(), payload.class, payload.nickname);

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

    // 레디스에서 모든 유저를 불러옵니다.
    // const allUsers = await getAllUsers();
    // // notification 페이로드를 만듭니다.

    // const spawnPayload = {
    //   players: allUsers.map((user) => ({
    //     playerId: user.id,
    //     nickname: user.nickname,
    //     class: user.myClass,
    //   })),
    // };

    // // 모든 유저에게 보낼 notification
    // const notification = createNotificationPacket(PACKET_ID.S_Spawn, spawnPayload);

    // // 모든 유저의 소켓에 notification 패킷을 던집니다.
    // allUsers.forEach((user) => {
    //   user.socket.write(notification);
    // });
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterHandler;
