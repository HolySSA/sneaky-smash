# Sneaky SMASH

## 🎈 팀 노션

- [프로젝트 브로셔](https://pollen-violin-7c8.notion.site/Sneaky-SMASH-15fca0528acf80bd8c4ec4250be8a169)
- [프로젝트 노션](https://teamsparta.notion.site/8-b5a0145e1e434ae6b45ca653cdfa04d2)

## 👋 프로젝트 소개

- 게임명: Sneaky SMASH
- 게임 장르: 배틀로얄 / RPG
- 프로젝트 소개: ‘Sneaky SMASH’는 던전 투기장에 입장해 몬스터를 사냥하며 성장하고, 최종적으로 넥서스를 파괴하면 승리하는 게임입니다.

## ⚙️ 서비스 아키텍처

![서비스 아키텍처](https://github.com/user-attachments/assets/021b15a0-417f-48f5-8f9a-05ccb40fde32)

## 🛠️ 기술 구현

| 기술               | 설명                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NodeJS**         | JavaScript를 사용하므로 개발 속도가 빠르다는 것이 장점입니다. 또한 npm을 통해 많은 라이브러리와 모듈을 사용할 수 있습니다.                                                                                                   |
| **Docker-Compose** | Docker Compose는 많은 Docker 컨테이너를 한 번에 관리할 수 있도록 해주며, 개발 환경과 운영 환경의 일관성을 보장합니다. 이를 통해 어떤 환경에서도 동일하게 동작할 수 있어 배포 오류를 줄일 수 있습니다.                        |
| **Traefik**        | API 게이트웨이로써 Traefik은 Docker와 연동하여 라우팅 관리가 간편합니다. 클라이언트가 어떤 서버로 진입을 원할 때 Traefik이 적절한 서버로 라우팅해줍니다. 또한 클라이언트의 요청을 여러 서버로 균등하게 분산해줄 수 있습니다. |
| **Redis**          | 인메모리 DB인 Redis는 데이터를 읽고 쓰는 속도가 매우 빨라 실시간 데이터를 캐싱하는 데에 유리하여 사용하게 되었습니다.                                                                                                        |
| **MySQL**          | 데이터의 무결성과 일관성이 장점인 MySQL을 데이터베이스로 사용하였습니다.                                                                                                                                                     |

## 📌 구현 기능 (정리 예정)

- 동시성 처리(비동기) - 메세지 큐 설명
- 캐싱 - redis
- 로드밸런싱 - Traefik

## 📝 패킷 구조 (정리 예정)

### User

- `C_Register : 27`
- `S_Register : 28`
- `C_Login  : 29`
- `S_Login  : 30`
- `C_Logout  : 101`
- `C_Logout  : 102`

### Town

- `C_Enter: 0`
- `S_Enter: 1`
- `S_Spawn: 2`
- `S_Despawn: 3`
- `C_Move: 4`
- `S_Move: 5`
- `C_Animation: 6`
- `S_Animation: 7`
- `C_Chat: 8`
- `S_Chat: 9`
- `S_EnterDungeon: 10`

### Battle

- `C_LeaveDungeon: 11`
- `S_LeaveDungeon: 12`
- `S_UpdatePlayerHp: 13`
- `S_UpdateMonsterHp: 14`
- `S_UpdateNexusHp: 15`
- `S_LevelUp: 16`
- `C_AttackedNexus: 17`
- `S_AttackedNexus: 18`
- `C_HitPlayer : 19`
- `S_HitPlayer : 20`
- `C_HitMonster : 21`
- `S_HitMonster : 22`
- `S_PlayerStatus: 23`
- `S_DeathPlayer: 24`
- `S_RevivePlayer: 25`
- `S_GetExp: 26`
- `S_NexusSpawn: 51`
- `S_PlayerKillCount: 52`
- `S_GameEnd: 53`

### Skills & Items

- `C_UseItem: 31`
- `S_UseItem: 32`
- `C_GetSkill: 33`
- `S_GetSkill: 34`
- `C_ShootProjectile: 35`
- `S_ShootProjectile: 36`
- `C_UseSkill: 37`
- `S_UseSkill: 38`

### Monsters

- `S_MonsterAttack: 39`
- `S_MonsterMove: 40`
- `S_MonsterKill: 41`
- `S_MonsterSpawn: 42`
- `S_MonsterKillCount: 43`

### Party

- `C_Party: 44`
- `S_Party: 45`
- `C_PartyJoin: 46`
- `S_PartyJoin: 47`
- `C_PartyLeave: 48`
- `S_PartyLeave: 49`
- `C_MatchStart: 50`

### Path

- `C_GetNavPath: 99`
- `S_GetNavPath: 100`
- `C_Authorize: 100`
- `C_Authorize: 100`
- `S_GameServerInfo: 100`
- `S_Ping: 254`
- `C_Ping: 255`

## 📁 디렉토리 구조 (정리 예정)

```
MULTIPLEROGUELIKE/
├── assets/
│ ├── classInfo.json
│ ├── dungeonInfo.json
│ ├── equipment.json
│ ├── item.json
│ ├── levelperStats.json
│ ├── monster.json
│ ├── projectile.json
│ ├── skill.json
│ ├── userExp.json
│ └── userSpawnTime.json
├── src/
│ ├── classes/
│ │ ├── manager/
│ │ │ ├── base.manager.js
│ │ │ ├── DB.Manager.js
│ │ │ └── latency.manager.js
│ │ └── model/
│ │ ├── dungeon.class.js
│ │ ├── monster.class.js
│ │ ├── monsterLogic.class.js
│ │ ├── nexus.class.js
│ │ ├── pathServer.js
│ │ └── user.class.js
│ ├── configs/
│ │ ├── constants/
│ │ │ ├── constants.js
│ │ │ ├── env.js
│ │ │ ├── header.js
│ │ │ ├── game.js
│ │ │ ├── packetId.js
│ │ │ └── serverUUID.js
│ │ └── config.js
│ ├── db/
│ │ ├── migrations/
│ │ │ └── createSchema.js
│ │ ├── model/
│ │ │ ├── boss.db.js
│ │ │ ├── characters.db.js
│ │ │ ├── dungeon.db.js
│ │ │ ├── equipment.db.js
│ │ │ ├── inventoryitem.db.js
│ │ │ ├── item.db.js
│ │ │ ├── monster.db.js
│ │ │ ├── skill.db.js
│ │ │ ├── stage.db.js
│ │ │ └── user.db.js
│ │ ├── query/
│ │ │ ├── boss.query.js
│ │ │ ├── characters.query.js
│ │ │ ├── dungeon.query.js
│ │ │ ├── equipment.query.js
│ │ │ ├── inventoryitem.query.js
│ │ │ ├── item.query.js
│ │ │ ├── monster.query.js
│ │ │ ├── skill.query.js
│ │ │ ├── stage.query.js
│ │ │ └── user.query.js
│ │ ├── sql/
│ │ │ ├── 0_user_db.sql
│ │ │ ├── 1_item_db.sql
│ │ │ ├── boss_db.sql
│ │ │ ├── characters_db.sql
│ │ │ ├── dungeon_db.sql
│ │ │ ├── equipment_db.sql
│ │ │ ├── inventoryItem_db.sql
│ │ │ ├── monsters_db.sql
│ │ │ ├── skill_db.sql
│ │ │ └── stage_db.sql
│ │ └── database.js
│ ├── events/
│ │ ├── onClose.js
│ │ ├── onConnection.js
│ │ ├── onData.js
│ │ ├── onEnd.js
│ │ └── onError.js
│ ├── handler/
│ │ ├── dungeon/
│ │ │ ├── hitMonster.handler.js
│ │ │ ├── hitPlayer.handler.js
│ │ │ └── leaveDungeon.handler.js
│ │ ├── game/
│ │ │ └── deathPlayer.notification.js
│ │ ├── healthCheck/
│ │ │ └── pong.handler.js
│ │ ├── item/
│ │ │ └── useItem.handler.js
│ │ ├── monster/
│ │ │ └── monsterKill.notification.js
│ │ ├── nexus/
│ │ │ └── attackedNexus.handler.js
│ │ ├── party/
│ │ │ ├──dungeon.start.handler.js
│ │ │ ├── party.handler.js
│ │ │ ├── party.join.handler.js
│ │ │ └── party.leave.handler.js
│ │ ├── skill/
│ │ │ ├── getSkill.handler.js
│ │ │ ├── shootProjectile.handler.js
│ │ │ └── useSkill.handler.js
│ │ ├── town/
│ │ │ ├── animation.handler.js
│ │ │ ├── chat.handler.js
│ │ │ ├── enter.handler.js
│ │ │ └── move.player.handler.js
│ │ ├── user/
│ │ │ └── login.handler.js
│ │ ├── result.js
│ │ └── index.js
│ ├── init/
│ │ ├── index.js
│ │ ├── loadProtos.js
│ │ └── protofiles.js
│ ├── protobuf/
│ │ ├── dungeon/
│ │ │ ├── battle.proto
│ │ │ ├── monster.proto
│ │ │ └── stage.proto
│ │ ├── town/
│ │ │ ├── match.proto
│ │ │ └── town.proto
│ │ └── user/
│ │ ├── customMessage.proto
│ │ ├── healthCheck.proto
│ │ ├── item.proto
│ │ ├── login.proto
│ │ └── skill.proto
│ ├── sessions/
│ │ ├── redis/
│ │ │ ├── helper.js
│ │ │ ├── redis.account.js
│ │ │ ├── redis.chat.js
│ │ │ ├── redis.health.js
│ │ │ ├── redis.party.js
│ │ │ ├── redis.server.js
│ │ │ └── redis.user.js
│ │ ├── dungeon.session.js
│ │ ├── sessions.js
│ │ ├── town.session.js
│ │ └── user.session.js
│ ├── utils/
│ │ ├── error/
│ │ │ ├── customError.js
│ │ │ ├── errorCodes.js
│ │ │ └── errorHandler.js
│ │ ├── etc/
│ │ │ ├── despawn.logic.js
│ │ │ ├── enter.logic.js
│ │ │ └── enterTown.js
│ │ ├── joi/
│ │ │ └── joiUtils.js
│ │ ├── navmesh/
│ │ │ └── navmesh.js
│ │ ├── notification/
│ │ │ ├── broadcastBySession.js
│ │ │ └── createNotification.js
│ │ ├── packet/
│ │ │ ├── createHeader.js
│ │ │ ├── createResponse.js
│ │ │ └── decodePacket.js
│ │ ├── redis/
│ │ │ └── redisManager.js
│ │ ├── socket/
│ │ │ └── messageQueue.js
│ │ ├── dateFormatter.js
│ │ ├── generateNexusId.js
│ │ ├── logger.js
│ │ ├── makeUUID.js
│ │ └── transfromCase.js
│ └── server.js
├── .dockerignore
├── .env
├── .gitignore
├── .prettierignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js
├── jsonconfig.json
├── nodemon.json
├── package-lock.json
├── package.json
└── README.md
```

## 👩‍💻 팀원

| 이름   | 블로그                                                  | GitHub                                             |
| ------ | ------------------------------------------------------- | -------------------------------------------------- |
| 정동현 | [803571](https://blog.naver.com/803571)                 | [803571](https://github.com/803571)                |
| 신성안 | [holy-s](https://holy-s.tistory.com/)                   | [HolySSA](https://github.com/HolySSA)              |
| 변우영 | [abcd9986](https://velog.io/@abcd9986/posts)            | [interneton](https://github.com/interneton)        |
| 정준엽 | [wnsduq8737](https://velog.io/@wnsduq8737/posts)        | [JungJaeU](https://github.com/JungJaeU)            |
| 송인우 | [songinwoo](https://velog.io/@songinwoo/posts)          | [INU-coder](https://github.com/INU-coder)          |
| 이정수 | [artbiit](https://velog.io/@artbiit/series)             | [artbiit](https://github.com/artbiit)              |
| 박용현 | [dydgustmdfl1231](https://dydgustmdfl1231.tistory.com/) | [YongHyeon1231](https://github.com/YongHyeon1231/) |
