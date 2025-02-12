/*===============================================
패킷 구조

totalLength(메세지 전체 길이) int 4 Byte 
packetType(패킷 타입) int 1 Byte
protobuf(프로토콜 버퍼 구조체) protobuf 가변
===============================================*/

const headerConfigs = Object.freeze({
  PACKET_LENGTH: 4,
  PACKET_TYPE_LENGTH: 1,
  PACKET_TOTAL_LENGTH: 5,
});
export default headerConfigs;
