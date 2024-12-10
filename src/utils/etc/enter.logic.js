import logger from '../logger.js';
import { getUserTransformById } from '../../sessions/user.session.js';
// message S_Enter {
//     PlayerInfo player = 1;      // 플레이어 정보 (추후 정의 예정)
// }
// message S_Spawn {
//     repeated PlayerInfo players = 1; // 스폰되는 플레이어 리스트 (추후 정의 예정)
// }

const enterLogic = async (socket, user) => {
  const playerPayload = {
    playerId: parseInt(user.id),
    nickname: user.nickname,
    class: user.myClass,
    transform: getUserTransformById(user.id),
  };

  logger.error('enterLogic. 미완성된 기능 호출함');

  // if (!result.success) {
  //   logger.error(`유저 ${socket.id} 접속 실패.`);
  // }
};

export default enterLogic;
