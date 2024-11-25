import createResponse from '../../utils/response/createResponse.js';
// 패킷명세
// message S_EnterDungeon {
//   DungeonInfo dungeonInfo = 1;    // 던전 정보 (추후 정의 예정)
//   repeated PlayerInfo player = 2; // 플레이어 정보 (추후 정의 예정)
//   string infoText = 3;            // 화면에 표시할 텍스트 (옵션)
// }
// message DungeonInfo {
//   int32 dungeonCode = 1;    // 던전 코드
//   repeated StageInfo stage = 2;
// }
// message StageInfo {
//   int32 stageId = 1;                        // 스테이지 ID
//   repeated MonsterStatus monsters = 2;      // 던전에 등장하는 몬스터들의 상태
// }

import { PACKET_ID } from "../../constants/packetId.js";

const enterDungeonHandler = async (socket, payload) => {

    const { dungeonLevel, roomId } = payload;
    console.log("🚀 ~ partyEnterDungeonHandler ~ roomId:", roomId)
    console.log("🚀 ~ partyEnterDungeonHandler ~ dungeonLevel:", dungeonLevel)

      const partyEnterPayload = {
        dungeonInfo: {dungeonCode : 101, StageInfo: []},
        player: [],
        string: "입장",
      };

      const packet = createResponse(PACKET_ID.S_EnterDungeon, partyEnterPayload);
  
      socket.write(packet);
    
  };
  
  export default enterDungeonHandler;
