import { PACKET_ID } from '../../configs/constants/packetId.js';
import { getGameAssets } from '../../init/loadAsset.js';
import configs from '../../configs/configs.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const { ITEM_DROP_RATE, SKILL_DROP_RATE, MONSTER_EXP } = configs;

let itemInstanceId = 1;

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

  if (drop < ITEM_DROP_RATE) {
    itemInstanceId++;
    const itemPivotId = 500;
    itemId = Math.floor(Math.random() * itemAssets.length) + itemPivotId;
    dungeon.createDroppedObject(playerId, itemId, itemInstanceId);
  } else if (drop < totalDropRate) {
    itemInstanceId++;
    const skillPivotId = 100;
    skillId = Math.floor(Math.random() * skillAssets.length) + skillPivotId;
    dungeon.createDroppedObject(playerId, skillId, itemInstanceId);
  }

  // 해당 유저 몬스터 죽인 숫자 노티
  dungeon.increaseMonsterKillCount(playerId);

  // 해당 유저 경험치 증가 + 레벨 체크
  dungeon.addExp(playerId, MONSTER_EXP);

  const monsterKillPayload = {
    monsterId,
    itemId,
    itemInstanceId: itemId === -1 && skillId === -1 ? -1 : itemInstanceId,
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
