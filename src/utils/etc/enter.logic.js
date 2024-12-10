import logger from '../logger.js';
import { getUserTransformById } from '../../sessions/user.session.js';
import { enqueueSend } from '../socket/messageQueue.js';
import createResponse from '../packet/createResponse.js';
import configs from '../../configs/configs.js';
import createNotificationPacket from '../notification/createNotification.js';
import { getProtoMessages } from '../../init/loadProtos.js';
const { PACKET_ID } = configs;

// message S_Enter {
//     PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

const enterLogic = async (socket, user) => {
  const playerPayload = {
    player: {
      playerId: parseInt(user.id),
      nickname: user.nickname,
      class: user.myClass,
      transform: getUserTransformById(user.id),
    },
  };

  logger.error('enterLogic. 미완성된 기능 호출함');
  let buffer = createResponse(PACKET_ID.S_Enter, playerPayload);
  enqueueSend(socket.UUID, buffer);

  //createNotificationPacket()
};

export default enterLogic;
