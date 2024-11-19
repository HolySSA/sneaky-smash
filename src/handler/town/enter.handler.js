import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';
import { addUser } from '../../utils/redis/user.session.js';
import { v4 as uuidv4 } from 'uuid';
// 패킷명세
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

const enterHandler = async (socket, payload) => {
  try {
     const user = await addUser(socket, uuidv4(), payload.class, payload.nickname);

     const player = {
        playerId: user.id,
        nickname: user.nickName,
        class: user.myClass,
     };

    const enterPayload = {
      player,
    };

    const response = createResponse(PACKET_ID.S_Enter, enterPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterHandler;
