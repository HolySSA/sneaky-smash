// import { transform } from 'lodash';
// import bcrypt from 'bcrypt';
import { PACKET_ID } from '../../constants/packetId.js';
import createResponse from '../../utils/response/createResponse.js';
import { townSession } from '../../utils/sessions/town.session.js';

export const movePlayerHandler = async ({ socket, payload }) => {
  const { posX, posY, posZ, rot } = payload;
  const user = await getUserBySocket(socket);
  if (!user) {
    throw new Error('유저미아move');
  }
  user.position = { posX, posY, posZ, rot };
  const S_MoveData = {
    playerId: user.id,
    transform: user.position,
  };
  if (!townSession) {
    console.error('타운미아');
    return;
  }
  const gameSession = getGameSessionById(user.currentSessionId);
  // const { posX, posY, posZ, rot }= payload.transform;
  user.position = { posX, posY, posZ, rot };

  const moveResponsePayload = {
    playerId: user.id, // 이동하는 플레이어 ID
    transform: user.position,
    // playerId: user.id,
    // transform: user.position,
  };
  const movePayload = createResponse(PACKET_ID.S_Move, moveResponsePayload);
  // const allUsers = gameSession.getAllUsers();
  townSession.users.forEach((targetUser) => {
    if (targetUser.id !== user.id) {
      try {
        targetUser.socket.writh(movePayload);
      } catch (e) {
        handleError(socket, e);
      }
    }
  });
};

// **TransformInfo** - 위치 및 회전 정보
// message TransformInfo {
//   float posX = 1;   // X 좌표 (기본값 : -9 ~ 9)
//   float posY = 2;   // Y 좌표 (기본값 : 1)
//   float posZ = 3;   // Z 좌표 (기본값 : -8 ~ 8)
//   float rot = 4;    // 회전 값 (기본값 : 0 ~ 360)
// }
// message C_Move {
//     TransformInfo transform = 1;    // 이동할 위치와 회전 정보
// }
// message S_Move {
//     int32 playerId = 1;             // 이동하는 플레이어 ID
//     TransformInfo transform = 2;    // 이동 후 위치와 회전 정보
// }

// // import { PACKET_ID } from '../../constants/packetId.js';
// import { townSession } from '../../utils/sessions/town.session.js';
// import protobuf from 'protobufjs';
// import { getUserBySocket } from '../../utils/sessions/user.session.js';

// const PROTO_PATH = './src/protobuf/town/town.proto';
// let S_MoveMessage; // Protobuf 메시지 캐시

// // Protobuf 메시지 로드
// protobuf.load(PROTO_PATH, (err, root) => {
//   if (err) {
//     console.error('Protobuf 파일 로드 실패:', err.message);
//     return;
//   }
//   S_MoveMessage = root.lookupType('S_Move');
// });

// /**
//  * 플레이어 이동 요청 처리 핸들러
//  * @param {object} socket 클라이언트 소켓
//  * @param {object} payload 요청 페이로드
//  */
// export const movePlayerHandler = ({ socket, payload }) => {
//   if (!S_MoveMessage) {
//     console.error('S_MoveMessage가 로드되지 않았습니다.');
//     return;
//   }

//   const { posX, posY, posZ, rot } = payload;
//   const user = getUserBySocket(socket);
//   if (!user) {
//     console.error('유저를 찾을 수 없습니다.');
//     return;
//   }

//   // 사용자 위치 업데이트
//   user.position = { posX, posY, posZ, rot };

//   // S_Move 패킷 데이터 생성
//   const S_MoveData = {
//     playerId: user.id,
//     transform: {
//       posX,
//       posY,
//       posZ,
//       rot,
//     },
//   };

//   // Protobuf 메시지 직렬화
//   const errMsg = S_MoveMessage.verify(S_MoveData);
//   if (errMsg) {
//     console.error('S_Move 메시지 검증 실패:', errMsg);
//     return;
//   }

//   const movePayload = S_MoveMessage.encode(S_MoveMessage.create(S_MoveData)).finish();

//   // 타운 세션 내 모든 사용자에게 패킷 전송 (자신 제외)
//   if (!townSession) {
//     console.error('타운 세션을 찾을 수 없습니다.');
//     return;
//   }

//   townSession.users.forEach((targetUser) => {
//     if (targetUser.id !== user.id) {
//       try {
//         targetUser.socket.write(movePayload);
//       } catch (e) {
//         console.error('S_Move 패킷 전송 중 오류 발생:', e.message);
//       }
//     }
//   });
// };
