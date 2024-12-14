import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getGameAssets } from '../../init/loadAsset.js';
import configs from '../../configs/configs.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const { ITEM_DROP_RATE, SKILL_DROP_RATE, MONSTER_EXP } = configs;

// 패킷명세

// message TransformInfo {
//   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// }

// **StatInfo** - 플레이어의 상세 스탯 정보
// message StatInfo {
//   int32 level = 1;                 // 플레이어 레벨
//   Stats stats = 2;
//   float exp = 3;                   // 경험치
//   float maxExp = 4;
// }

// message S_MonsterKill {
//   int32 monsterId = 1; // 몬스터 식별 ID
//   int32 itemId = 2;
//   int32 playerId = 3;
//   int32 skillId = 4;
//   TransformInfo transform = 5;
//   float exp = 6;
// }

// message S_GetExp { ★
//   int32 playerId = 1;
//   int32 expAmount = 2;
//   }

let itemInstanceId = 0;

const monsterKillNotification = (socket, monster, dungeon, dungeonAllUsersUUID) => {
  const playerId = socket.id;

  const monsterId = monster.id;
  const transform = monster.transform;

  const gameAssets = getGameAssets();
  const itemAssets = gameAssets.item;
  const skillAssets = gameAssets.skillInfo;

  let itemId = -1;
  let skillId = -1;

  const totalDropRate = ITEM_DROP_RATE + SKILL_DROP_RATE;
  const drop = Math.random();

  if (drop < totalDropRate) {
    if (drop < ITEM_DROP_RATE) {
      const itemPivotId = 500;  
      itemId = Math.floor(Math.random() * itemAssets.length) + itemPivotId;      

    } else {
      const skillPivotId = 100;      
      skillId = Math.floor(Math.random() * skillAssets.length) + skillPivotId;
    }
  }

  // 해당 유저 몬스터 죽인 숫자 노티
  dungeon.increaseMonsterKillCount(playerId);

  // 해당 유저 경험치 증가 + 레벨 체크
  dungeon.addExp(playerId, MONSTER_EXP);

  const monsterKillPayload = {
    monsterId,
    itemId,
    itemInstanceId: itemId === -1 && skillId === -1 ? -1 : itemInstanceId++,
    playerId,
    skillId,
    transform,
  };

  createNotificationPacket(PACKET_ID.S_MonsterKill, monsterKillPayload, dungeonAllUsersUUID);
};

export default monsterKillNotification;

// 유저한테 레벨당 maxExp가 있고, ( 유저에게 curExp랑 maxExp가 있어야함)
// 몬스터 킬 noti에서 고정 exp를 주고,
// maxExp를 넘어가면 레벨업을 보낸다 (S_LevelUp)

// **StatInfo** - 플레이어의 상세 스탯 정보
// message StatInfo {
//   int32 level = 1;                 // 플레이어 레벨
//   Stats stats = 2;
//   float exp = 3;                   // 경험치
//   float maxExp = 4;
// }
