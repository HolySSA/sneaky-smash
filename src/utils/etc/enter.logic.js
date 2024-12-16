import { setRedisUserUUID } from '../../sessions/redis/redis.user.js';
import { getUserById } from '../../sessions/user.session.js';
import spawnPlayerTown from './enterTown.js';

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
      playerId: socket.id,
      nickname: character.nickname,
      class: character.myClass,
      transform: user.transform,
    },
  };
  await setRedisUserUUID(socket); // 소켓으로 레디스에서 해당 유저의 UUID 설정
  user.nickname = character.nickname;
  user.myClass = character.myClass;
 
  spawnPlayerTown(socket, user, playerPayload);
};

export default enterLogic;
