# 최종 프로젝트!

readme에서 이거 c가 없음이 붙은 핸들러부분은
index에 일단 추가하지않았습니다
인지하신상태에서 필요하시면 추가해주세요

프로젝트 구조
multipleroguelike
src/
├── handlers/
│ ├── classes/
│ │ ├── manager/
│ │ │ └── sampleManager.js
│ │ └── model/
│ │ └── userClass.js
│ ├── config/
│ │ └── config.js
│ ├── constants/
│ │ ├── env.js
│ │ ├── header.js
│ │ └── packetId.js
│ ├── db/
│ │ ├── user/
│ │ │ ├── user.db.js
│ │ │ └── user.query.js
│ │ └── database.js
│ ├── events/
│ │ ├── onConnection.js
│ │ ├── onData.js
│ │ ├── onEnd.js
│ │ └── onError.js
│ ├── handler/
│ │ ├── user/
│ │ │ ├── login.handler.js
│ │ │ └── register.handler.js
│ │ └── index.js
│ ├── init/
│ │ ├── index.js
│ │ ├── loadProtos.js
│ │ └── protofiles.js
│ ├── protobuf/
│ │ ├── dungeon/
│ │ │ ├── battle.proto
│ │ │ └── boss.proto
│ │ ├── town/
│ │ │ ├── login.proto
│ │ │ ├── match.proto
│ │ │ └── town.proto
│ │ └── user/
│ │ ├── customMessage.proto
│ │ ├── inventory.proto
│ │ ├── item.proto
│ │ ├── player.proto
│ │ └── skill.proto
│ ├── utils/
│ │ ├── error/
│ │ │ ├── customError.js
│ │ │ ├── errorCodes.js
│ │ │ └── errorHandler.js
│ │ ├── joi/
│ │ │ └── joiUtils.js
│ │ ├── notification/
│ │ │ └── createNotification.js
│ │ ├── parser/
│ │ │ └── packetParser.js
│ │ ├── redis/
│ │ │ └── redisManager.js
│ │ ├── response/
│ │ │ └── createResponse.js
│ │ ├── dateFormatter.js
│ │ └── transfromCase.js
│ ├── protobuf.zip
│ └── server.js
├── .env
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
└── client.js

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

## town

C_Enter: 0,
S_Enter: 1,
S_Spawn: 2, -> 이거 c가 없음
S_Despawn: 3, -> 이거 c가 없음
C_Move: 4,
S_Move: 5,
C_Animation: 6,
S_Animation: 7,
C_Chat: 8,
S_Chat: 9,
S_EnterDungeon: 10,-> 이거 c가 없음

## battle

C_LeaveDungeon: 12,
S_LeaveDungeon: 13,
S_UpdatePlayerHp: 14, -> 이거 c가 없음
S_UpdatePlayerMp: 15, -> 이거 c가 없음
S_UpdateMonsterHp: 16,-> 이거 c가 없음
C_MonsterAction: 17,
S_MonsterAction: 18,

## user

C_Register: 19,
S_Register: 20,
C_LogIn: 21,
S_LogIn: 22,

## item

C_UseItem: 27,
S_UseItem: 28,
C_PurchaseItem: 29,
S_PurchaseItem: 30,
C_SellItem: 32,
S_SellItem: 33,
C_GetItem: 34,
S_GetItem: 35,
C_DropItem: 36,
S_DropItem: 37,
C_EquipEquipment: 38,
S_EquipEquipment: 39,
C_UnequipWeapon: 40,
S_UnequipWeapon: 41,

S_ItemSoldOut: 31, -> 이거 c가 없음

## game

C_EnterPortal: 23,
S_EnterPortal: 24,
S_Inventory: 25,
C_Inventory: 26,
C_UseSkill: 42,
S_UseSkill: 43,

## monster

C_MonsterAttack: 44,
S_MonsterAttack: 45,
C_MonsterMove: 46,
S_MonsterMove: 47,
C_MonsterKill: 48,
S_MonsterKill: 49,
C_MonsterSpawn: 50,
S_MonsterSpawn: 51,

## boss

C_BossSpawn: 52,
S_BossSpawn: 53,
C_TargetPlayer: 54,
S_TargetPlayer: 55,
C_ActionBoss: 58,
S_ActionBoss: 59,
S_Phase: 60, -> 이거 c가 없음

## party

C_Party: 61,
S_Party: 62,
C_PartyJoin: 63,
S_PartyJoin: 64,
C_PartyLeave: 65,
S_PartyLeave: 66,
C_MatchStart: 67
