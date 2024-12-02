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

C_LeaveDungeon: 11,
S_LeaveDungeon: 12,
S_UpdatePlayerHp: 13, -> 이거 c가 없음
S_UpdateMonsterHp: 14,-> 이거 c가 없음
S_UpdateNexusHp = 15,
C_MonsterAction: 16,
S_MonsterAction: 17,
S_LevelUp = 18,
C_DestroyNexus = 19,
S_DestroyNexus = 20,
C_PlayerAttack = 21,
S_PlayerAttack = 22,

## user

C_Register: 23,
S_Register: 24,
C_LogIn: 25,
S_LogIn: 26,

## item

C_UseItem: 27,
S_UseItem: 28,

## game

C_EquipSkill = 29,
S_EquipSkill = 30,
C_UseSkill = 31,
S_UseSkill = 32,

## monster

C_MonsterAttack: 33,
S_MonsterAttack: 34,
C_MonsterMove: 35,
S_MonsterMove: 36,
C_MonsterKill: 37,
S_MonsterKill: 38,
C_MonsterSpawn: 39,
S_MonsterSpawn: 40,

## party

C_PartyJoin = 41,
C_PartyLeave = 42,
S_Party = 43
