import logger from '../logger.js';
import { getUserTransformById, getUserById } from '../../sessions/user.session.js';
import { enqueueSend } from '../socket/messageQueue.js';
import createResponse from '../packet/createResponse.js';
import configs from '../../configs/configs.js';
import createNotificationPacket from '../notification/createNotification.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import {
  addUserForTown,
  getAllUserUUIDByTown,
  getAllUserByTown,
  getUserTransformById as getTownTransformByUserId,
} from '../../sessions/town.session.js';
const { PACKET_ID } = configs;

// message S_Enter {
//     PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

/**
 * 타운에 입장하는 함수
 */
const enterLogic = async (socket, character) => {
  const user = getUserById(socket.id);
  const playerPayload = {
    player: {
      playerId: parseInt(socket.id),
      nickname: character.nickname,
      class: character.myClass,
      transform: user.transform,
    },
  };

  user.nickname = character.nickname;
  user.myClass = character.myClass;

  let buffer = createResponse(PACKET_ID.S_Enter, playerPayload);

  addUserForTown(user);
  enqueueSend(socket.UUID, buffer);
  const allUUID = getAllUserUUIDByTown();
  if (allUUID.length > 1) {
    const players = [];
    for (const [_, user] of getAllUserByTown()) {
      players.push({
        playerId: parseInt(user.id),
        nickname: user.nickname,
        class: user.myClass,
        transform: user.transform,
      });
    }

    const spawnPayload = {
      players,
    };

    createNotificationPacket(PACKET_ID.S_Spawn, spawnPayload, allUUID);
  }
};

export default enterLogic;
