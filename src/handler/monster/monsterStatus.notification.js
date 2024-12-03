import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import handleError from '../../utils/error/errorHandler.js';

// message MonsterStatus {
//     int32 monsterId = 1; // 몬스터 식별 ID
//     int32 monsterModel = 2; // 몬스터 모델 ID
//     string monsterName = 3; // 몬스터 이름
//     float monsterHp = 4; // 몬스터 체력
//   }
// message S_MonsterStatus {
// 	int32 monsterId = 1;
// 	MonsterStatus status = 2;
// }
const status = {
  monsterId,
  monsterModel,
  monsterName,
  monsterHp,
};
const monsterStatusNotification = async (socket, payload) => { 
  try {      
      const monsterStatusPayload = {
        monsterId,
        status,
      };
      const response = createResponse(PACKET_ID.S_MonsterStatus, monsterStatusPayload);
      socket.write(response);
    } catch (e) {
      handleError(socket, e);
    }
  };
  
  export default monsterStatusNotification;