import { PACKET_ID } from '../../constants/packetId.js';
import { getUserById } from '../../utils/redis/user.session.js';
import createResponse from '../../utils/response/createResponse.js';
/**
 * 무브 핸들러
 * @param {object} socket - 클라이언트 소켓
 * @param {object} payload - 클라이언트에서 전송한 데이터
 */
export const movePlayerHandler = async (socket, payload) => {
  try {
    const { posX, posY, posZ, rot } = payload.transform;

    // 소켓에서 유저 정보 가져오기
    const user = await getUserById(socket.id);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    // 유저 위치 업데이트 - redis에 저장될 유저 세션에 position을 넣어야 한다.
    user.position = { posX, posY, posZ, rot };

    // S_Move 패킷 데이터 생성
    const moveResponsePayload = {
      playerId: user.id,
      transform: {
        posX: user.position.posX,
        posY: user.position.posY,
        posZ: user.position.posZ,
        rot: user.position.rot,
      },
    };

    // S_Move 패킷 생성
    const movePayload = createResponse(PACKET_ID.S_Move, moveResponsePayload);
    
    // 나한테 위치를 보내는 패이로드가 없음.+패킷전달까지. selfPosition
    // 분할터미널 테스트떄는 세션 찾는로직을 빼고 임시 아이디값을 넣어서 해봐야함
    // 타운 세션의 다른 유저들에게 S_Move 패킷 전송 - 타운 Enter할 때 townSession에 유저 정보 넣기
    
    // if (!townSession || !townSession.users) {
    //   console.error('타운 세션을 찾을 수 없습니다.');
    //   return;
    // }

    // // 타운 세션의 다른 유저들에게 S_Move 패킷 전송
    // townSession.users.forEach((targetUser) => {
    //   if (targetUser.id !== user.id) {
    //     try {
    //       targetUser.socket.write(movePayload);
    //     } catch (error) {
    //       console.error('S_Move 패킷 전송 중 오류 발생:', error.message);
    //     }
    //   }
    // });
    
  } catch (error) {
    console.error('무브 핸들러 실행 중 오류 발생:', error.message);
  }
};
