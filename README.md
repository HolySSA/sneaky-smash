# Sneaky SMASH

## 🎈 팀 노션
[브로셔]([https://example.com](https://pollen-violin-7c8.notion.site/Sneaky-SMASH-15fca0528acf80bd8c4ec4250be8a169))
[노션](https://teamsparta.notion.site/8-b5a0145e1e434ae6b45ca653cdfa04d2)

## Town

- `C_Enter: 0`
- `S_Enter: 1`
- `S_Spawn: 2` <!-- C 없음 -->
- `S_Despawn: 3` <!-- C 없음 -->
- `C_Move: 4`
- `S_Move: 5`
- `C_Animation: 6`
- `S_Animation: 7`
- `C_Chat: 8`
- `S_Chat: 9`
- `S_EnterDungeon: 10` <!-- C 없음 -->

## Battle

- `C_LeaveDungeon: 11`
- `S_LeaveDungeon: 12`
- `S_UpdatePlayerHp: 13`
- `S_UpdateMonsterHp: 14`
- `S_UpdateNexusHp: 15`
- `S_LevelUp: 16`
- `C_DestroyNexus: 17`
- `S_DestroyNexus: 18`
- `C_PlayerAttackToPlayer: 19`
- `S_PlayerAttackToPlayer: 20`
- `C_PlayerAttackToMonster: 21`
- `S_PlayerAttackToMonster: 22`
- `S_PlayerStatus: 23`

## Skills & Items

- `C_UseItem: 28`
- `S_UseItem: 29`
- `C_GetSkill: 30`
- `S_GetSkill: 31`
- `C_ShootProjectile: 32`
- `S_ShootProjectile: 33`
- `C_UseSkill: 34`
- `S_UseSkill: 35`

## Monsters

- `S_MonsterAttack: 36`
- `S_MonsterMove: 37`
- `S_MonsterKill: 38`
- `S_MonsterSpawn: 39`
- `S_MonsterStatus: 40`

## Party

- `C_Party: 41`
- `S_Party: 42`
- `C_PartyJoin: 43`
- `S_PartyJoin: 44`
- `C_PartyLeave: 45`
- `S_PartyLeave: 46`
- `C_MatchStart: 47`

## Path

- `C_GetNavPath: 99`
- `S_GetNavPath: 100`


@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

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
