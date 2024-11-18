import { transform } from 'lodash';
import { PACKET_ID } from '../../constants/packetId';
import createResponse from '../../utils/response/createResponse';

export const movePlayerHandler = ({ socket, payload }) => {
  const { posX, posY, posZ, rot } = payload;
  const user = getUserBySocket(socket);
  if (!user) {
    throw new Error('유저미아move');
  }
  user.position = { posX, posY, posZ, rot };
  const S_MoveData = {
    playerId: user.id,
    trans,
  };

  try {
    const gameSession = getGameSessionById(user.currentSessionId);
    // const { posX, posY, posZ, rot }= payload.transform;
    user.position = { posX, posY, posZ, rot };

    const moveResponsePayload = {
      playerId: user.id,
      transform: user,
      position,
    };
    const moveResponse = createResponse(PACKET_ID.S_Move, moveResponsePayload);
    const allUsers = gameSession.getAllUsers();
  } catch (e) {}
};

// **TransformInfo** - 위치 및 회전 정보
// message TransformInfo {
//   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// }
// message C_Move {
//     TransformInfo transform = 1;    // 이동할 위치와 회전 정보
// }
// message S_Move {
//     int32 playerId = 1;             // 이동하는 플레이어 ID
//     TransformInfo transform = 2;    // 이동 후 위치와 회전 정보
// }
