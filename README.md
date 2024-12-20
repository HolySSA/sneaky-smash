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

### Town

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

### Battle

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

### Skills & Items

- `C_UseItem: 28`
- `S_UseItem: 29`
- `C_GetSkill: 30`
- `S_GetSkill: 31`
- `C_ShootProjectile: 32`
- `S_ShootProjectile: 33`
- `C_UseSkill: 34`
- `S_UseSkill: 35`

### Monsters

- `S_MonsterAttack: 36`
- `S_MonsterMove: 37`
- `S_MonsterKill: 38`
- `S_MonsterSpawn: 39`
- `S_MonsterStatus: 40`

### Party

- `C_Party: 41`
- `S_Party: 42`
- `C_PartyJoin: 43`
- `S_PartyJoin: 44`
- `C_PartyLeave: 45`
- `S_PartyLeave: 46`
- `C_MatchStart: 47`

### Path

- `C_GetNavPath: 99`
- `S_GetNavPath: 100`

## 📁 디렉토리 구조 (정리 예정)

```
src/
├── handlers/
│ ├── classes/
│ │ ├── manager/
│ │ │ └── sampleManager.js
│ │ └── model/
│ │ └── userClass.js
│ ├── configs/
│ │ ├── config.js
│ │ └── constants/
│ │  ├── constants.js
│ │  ├── env.js
│ │  ├── header.js
│ │  ├── game.js
│ │  ├── packetId.js
│ │  └── serverUUID.js
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
