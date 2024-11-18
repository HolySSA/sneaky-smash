# 최종 프로젝트!

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
├── client.js
├── package-lock.json
├── package.json
└── client.js

│ ├── enterHandler.js # C_Enter / S_Enter 처리
│ ├── moveHandler.js # C_Move / S_Move 처리
│ ├── chatHandler.js # C_Chat / S_Chat 처리
