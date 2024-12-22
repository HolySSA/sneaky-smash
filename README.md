# SNEAKY SMASH

## 🎈 팀 노션

- [프로젝트 브로셔](https://pollen-violin-7c8.notion.site/SNEAKY-SMASH-164ca0528acf8072a337cc4abd620ab6)
- [프로젝트 노션](https://teamsparta.notion.site/8-b5a0145e1e434ae6b45ca653cdfa04d2)

## 👋 프로젝트 소개

- 게임명: SNEAKY SMASH
- 프로젝트 기간: 2024.11.13(수) ~ 2024.12.22(일)
- 게임 장르: 배틀로얄 / RPG
- 프로젝트 소개: **SNEAKY SMASH**는 던전 투기장에 입장해 몬스터를 사냥하며 성장하고, 최종적으로 넥서스를 파괴하면 승리하는 게임입니다.

## ⚙️ 서비스 아키텍처

![서비스 아키텍처](https://github.com/user-attachments/assets/1cf53135-a523-4f57-8f92-5a67a8c22240)

## 🛠️ 기술 구현

<b>Programming Languages</b>
    <br>
    <img src="https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=white"
        alt="JavaScript Badge" />
    <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white"
        alt="C# Badge" />
    <br>
    <b>Socket Programming</b>
    <br>
    <img src="https://img.shields.io/badge/TCP-00599C?style=for-the-badge&logo=protocol&logoColor=white"
        alt="TCP Badge" />
    <img src="https://img.shields.io/badge/Protobuf-336791?style=for-the-badge&logo=google&logoColor=white"
        alt="Protobuf Badge" />
    <br>
    <b>Game Server & Login Server</b>
    <br>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"
        alt="Node.js Badge" />
    <br>
    <b>Pathfinding Server</b>
    <br>
    <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white"
        alt="C# Badge" />
    <br>
    <b>Client</b>
    <br>
    <img src="https://img.shields.io/badge/Unity-000000?style=for-the-badge&logo=unity&logoColor=white"
        alt="Unity Badge" />
    <br>
    <b>DB</b>
    <br>
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"
        alt="MySQL Badge" />
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"
        alt="Redis Badge" />
    <br>
    <b>DevOps</b>
    <br>
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"
        alt="Docker Badge" />
    <img src="https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white"
        alt="Docker Compose Badge" />
    <img src="https://img.shields.io/badge/Traefik-000000?style=for-the-badge&logo=traefik&logoColor=white"
        alt="Traefik Badge" />
    <img src="https://img.shields.io/badge/VPS-FF6600?style=for-the-badge&logo=linux&logoColor=white" alt="VPS Badge" />
    <br>
    <b>VCS (Virsion Control System)</b>
    <br>
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"
        alt="GitHub Badge" />
    <img src="https://img.shields.io/badge/Unity%20Version%20Control-000000?style=for-the-badge&logo=unity&logoColor=white"
        alt="Unity Version Control Badge" />
    <br>

## 📌 주요 기능 및 구성 요소

### **VPS (Virtual Private Server)**

고가용성 서버를 구성하기 위해 VPS를 사용했습니다.

- **Minimum Server**: 필요한 서비스를 직접 설치하여 불필요한 서비스 동작 방지.
- **확장성 고려**: 가상 노드 간 통신을 허용하여 서비스 수평 확장 가능.
- **위험 관리**: Fail-Over 복구를 위해 스냅샷 저장.
- **보안성**: 외부로부터 숨겨진 노드를 통해 보안성 강화.

### **Traefik**

클라이언트 요청을 적절한 서비스로 라우팅하는 API-Gateway로 활용했습니다.

- **리다이렉팅**: 클라이언트 요청을 적합한 백엔드 서비스로 라우팅.
- **연결 지원**: SNI(Server Name Indication) 기반 서비스 연결 및 관리.

### **Login Server**

로그인 및 유저 관리를 담당하며, 게임 서버 상태를 안내합니다.

- **유저 관리**: 로그인/회원 가입으로 등록된 유저 인증.
- **게임 서버 안내**: Redis를 활용해 서버 상태를 확인 및 갱신.

### **Game Server**

인가된 유저만 접속 가능한 실제 게임 서비스 서버입니다.

- **이동 동기화**: 마을 및 던전에 따라 이동 상태를 동기화.
- **애니메이션 동기화**: 캐릭터의 모션 및 감정 표현 동기화.
- **최대 인원 관리**: 서버 부하 방지 및 유저 경험 최적화.
- **게임 로직**: 몬스터, 넥서스, PVP 등 게임 로직 처리.
- **상태 동기화**: 캐릭터, 몬스터, 넥서스 등 다양한 개체에 대한 상태를 동기화.
- **채팅 관리**: Redis를 통해 마을 및 던전 채팅 지원. (마을에서는 서버가 달라도 Redis를 통해 채팅 공유. 던전의 경우, 해당 던전 내에서만 채팅 공유)

### **Pathfinding Server**

몬스터 길 찾기를 담당하는 독립 서버입니다.

- **독립성**: 각 몬스터 간 길 찾기 요청을 독립적으로 처리.
- **효율적인 연산**: 경량화된 데이터와 Unity 연산 최적화 라이브러리 활용.
- **게임 서버 부하 감소**: 게임 서버와 연산 분리.

### **Message Queue**

클라이언트 및 서버 간 순차적 처리를 위한 메시지 큐를 사용했습니다.

- **클라이언트**: 송수신 순서를 보장하기 위한 큐 동작.
- **서버**: 클라이언트별 독립적인 메시지 큐 제공.

### **MySQL / Redis**

데이터 영속성과 캐싱 전략을 위해 MySQL과 Redis를 함께 활용했습니다.

- **MySQL**: 데이터 영속성과 복잡한 쿼리 처리.
- **Redis**: 자주 호출되는 데이터에 대한 캐싱 전략 및 서버 간 상태/메세지 공유.

### **Docker**

서버 배포 및 관리 자동화를 위해 Docker를 활용했습니다.

- **배포 용이**: Docker-Compose를 통해 서버 생성 및 관리.
- **Fail-Over 관리**: 서비스 재시작 및 독립적 실행 환경 제공.
- **Traefik 호환성**: 복잡도를 낮춘 API-Gateway 설정.
- **수평 확장**: 필요 시 서버 추가/삭제로 유저 수용량 제어.
- **리소스 분배**: 같은 장치 내에서 동작 하더라도 할당할 리소스를 선택하여 효율적으로 리소스 분배.

## 📝 패킷 구조

<details>
<summary>📦 패킷</summary>

### User

- `C_Register : 27`
- `S_Register : 28`
- `C_Login  : 29`
- `S_Login  : 30`
- `C_Logout  : 101`
- `S_Logout  : 102`

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
- `C_Authorize: 103`
- `S_Authorize: 104`
- `S_GameServerInfo: 253`
- `S_Ping: 254`
- `C_Ping: 255`

</details>

## 📁디렉토리 구조

<details>
<summary>📂 디렉토리 </summary>

#### 📂 assets: 게임 데이터
#### 📂 src: 서버 전체 로직
- 📂 `classes`: class 파일들
  - 📂 `manager`: 특정 기능 매니저
  - 📂 `model`: 게임 로직 및 데이터 모델 기반
- 📂 `configs`: 설정 관련
  - 📂 `constants`: 상수 정의
  - `config.js`: 모든 설정에 대한 접근
- 📂 `db`: 데이터베이스 관련
  - 📂 `migrations`: 마이그레이션 스크립트
  - 📂 `model`: 런타임 질의 함수
  - 📂 `query`: 런타임 질의 문
  - 📂 `sql`: 마이그레이션 질의문
- 📂 `events`: 소켓 이벤트들
- 📂 `handler`: 소켓 수신 핸들러
  - 📂 `dungeon`
  - 📂 `game`
  - 📂 `healthCheck`
  - 📂 `item`
  - 📂 `monster`
  - 📂 `nexus`
  - 📂 `party`
  - 📂 `skill`
  - 📂 `town`
  - 📂 `user`
- 📂 `init`: 서버 초기화 모음
- 📂 `protobuf`: 메세지 모음
  - 📂 `dungeon`
  - 📂 `town`
  - 📂 `user`
- 📂 `sessions`: 세션 모음
  - 📂 `redis`: 레디스 기능 모음
- 📂 `utils`: 자주쓰는 기능 모음
  - 📂 `error`
  - 📂 `etc`
  - 📂 `joi`
  - 📂 `notification`
  - 📂 `packet`
  - 📂 `redis`
  - 📂 `socket`
- `server.js`: main 실행 스크립트

---

</details>

## 👩‍💻 팀원

| 이름   | 블로그                                                       | GitHub                                             |
| ------ | ------------------------------------------------------------ | -------------------------------------------------- |
| 정동현 | [803571 Blog](https://blog.naver.com/803571)                 | [803571](https://github.com/803571)                |
| 신성안 | [holy-s Blog](https://holy-s.tistory.com/)                   | [HolySSA](https://github.com/HolySSA)              |
| 변우영 | [abcd9986 Blog](https://velog.io/@abcd9986/posts)            | [interneton](https://github.com/interneton)        |
| 정준엽 | [wnsduq8737 Blog](https://velog.io/@wnsduq8737/posts)        | [JungJaeU](https://github.com/JungJaeU)            |
| 송인우 | [songinwoo Blog](https://velog.io/@songinwoo/posts)          | [INU-coder](https://github.com/INU-coder)          |
| 이정수 | [artbiit Blog](https://velog.io/@artbiit/series)             | [artbiit](https://github.com/artbiit)              |
| 박용현 | [dydgustmdfl1231 Blog](https://dydgustmdfl1231.tistory.com/) | [YongHyeon1231](https://github.com/YongHyeon1231/) |
