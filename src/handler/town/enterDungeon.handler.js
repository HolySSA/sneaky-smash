import createResponse from '../../utils/response/createResponse';
import { PACKET_ID } from '../../constants/packetId';
import handleError from '../../utils/error/errorHandler';
// 패킷명세
// message S_Enter {
//     PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }

const enterDungeonHandler = async (socket, payload) => {
  try {
    const { dungeonInfo, player, infoText } = payload;

    const enterDungeonPayload = {
      dungeonInfo,
      player,
      infoText,
    };

    const response = createResponse(PACKET_ID.S_EnterDungeon, enterDungeonPayload);
    socket.write(response);
  } catch (e) {
    handleError(socket, e);
  }
};
export default enterDungeonHandler;
