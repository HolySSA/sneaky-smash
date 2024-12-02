import net from 'net';
import createResponse from '../../utils/response/createResponse.js';
import { PACKET_ID } from '../../constants/packetId.js';
import decodeMessageByPacketId from '../../utils/parser/decodePacket.js';

class PathServer {
  constructor() {
    this.client = null; // Unity 서버와의 연결 소켓
    this.responseHandlers = []; // 응답 핸들러 큐
    this.isConnected = false; // 연결 상태 플래그
    this.buffer = Buffer.alloc(0);
  }

  async connectToUnityServer(host, port) {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        console.log('이미 Unity 서버와 연결되어 있습니다.');
        return resolve();
      }

      this.client = new net.Socket();

      this.client.connect(port, host, () => {
        Buffer.alloc(0);
        console.log(`Unity 서버에 연결됨: ${host}:${port}`);
        this.isConnected = true;
        resolve();
      });

      this.client.on('data', (data) => this.onData(data));
      this.client.on('error', (err) => this.onError(err, reject));
      this.client.on('close', () => this.onClose());
    });
  }

  onData(data) {
    // 수신된 데이터를 로그로 확인
    console.log(`수신된 원시 데이터: ${data.toString('hex')}`);

    // 수신된 데이터를 버퍼에 추가
    this.buffer = Buffer.concat([this.buffer, data]);

    const totalHeaderLength = 5; // 4바이트 패킷 길이 + 1바이트 패킷 ID

    while (this.buffer.length >= totalHeaderLength) {
      const packetLength = this.buffer.readUInt32BE(0); // 패킷 길이
      const packetType = this.buffer.readUInt8(4); // 패킷 ID

    //   console.log(`패킷 길이: ${packetLength}, 패킷 ID: ${packetType}`);

      // 잘못된 패킷 길이 처리
      if (packetLength > this.buffer.length || packetLength <= totalHeaderLength) {
        console.error(`Invalid packet length: ${packetLength} for packet ID: ${packetType}`);

        // 잘못된 헤더 부분만 제거하고 나머지 데이터 유지
        this.buffer = this.buffer.slice(totalHeaderLength);
        continue; // 다음 데이터 처리 시도
      }

      const packet = this.buffer.subarray(totalHeaderLength, packetLength);
      this.buffer = this.buffer.subarray(packetLength);

      try {
        const decodedMessage = decodeMessageByPacketId(packetType, packet);
        // console.log(`Decoded Packet ID: ${packetType}, Message:`, decodedMessage);

        const handler = this.responseHandlers.shift();
        if (handler) {
          handler(null, decodedMessage);
        }
      } catch (err) {
        console.error('패킷 디코딩 중 오류 발생:', err.message);
      }
    }
  }

  onError(err, reject) {
    console.error('Unity 서버 연결 오류:', err.message);
    this.isConnected = false;

    // 모든 대기 중인 요청에 에러 전달
    while (this.responseHandlers.length > 0) {
      const handler = this.responseHandlers.shift();
      handler(err, null);
    }

    reject(err);
  }

  onClose() {
    console.log('Unity 서버와의 연결 종료');
    this.isConnected = false;
    this.client = null;

    // 모든 대기 중인 요청에 에러 전달
    while (this.responseHandlers.length > 0) {
      const handler = this.responseHandlers.shift();
      handler(new Error('Connection closed'), null);
    }
  }

  async sendPathRequest(startPoint, targetPoint) {
    if (!this.isConnected) {
      throw new Error('Unity 서버에 연결되지 않았습니다.');
    }

    // 요청 패킷 생성
    const response = createResponse(PACKET_ID.C_GetNavPath, {
      playerPosition: targetPoint,
      enemyPosition: startPoint,
    });

    return new Promise((resolve, reject) => {
      // 응답 처리 핸들러 등록
      this.responseHandlers.push((err, data) => {
        if (err) return reject(err);

        // 디코딩된 데이터를 그대로 반환
        resolve(data);
      });

      // 데이터 전송
      this.client.write(response);
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.isConnected = false;
      console.log('Unity 서버와의 연결을 종료했습니다.');
    }
  }
}

export default PathServer;
