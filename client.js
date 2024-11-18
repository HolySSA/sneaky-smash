import net from "net";
import protobuf from "protobufjs";
import config from "./src/config/config.js";
import { PACKET_ID } from "./src/constants/packetId.js";

// .proto 파일 경로
const PROTO_PATH = "./src/protobuf/town/login.proto";

// 패킷 생성 및 전송 함수
async function loadProtoAndSend(packetType, messageType, payload) {
    try {
        // .proto 파일 로드
        const root = await protobuf.load(PROTO_PATH);
        const Message = root.lookupType("C_Register");

        // 페이로드 검증
        const errMsg = Message.verify(payload);
        if (errMsg) {
            throw new Error(`잘못된 페이로드: ${errMsg}`);
        }

        // 페이로드 인코딩
        const messageBuffer = Message.encode(Message.create(payload)).finish();

        // 4바이트 길이 + 1바이트 패킷 타입 + 페이로드
        const packetLength = 1 + messageBuffer.length;
        const buffer = Buffer.alloc(4 + packetLength);

        buffer.writeUInt32BE(packetLength, 0); // 패킷 길이
        buffer.writeUInt8(packetType, 4);      // 패킷 타입
        messageBuffer.copy(buffer, 5);         // 페이로드 복사

        // TCP 소켓 연결
        const client = new net.Socket();
        client.connect(config.server.port, config.server.host, () => {
            console.log(`${messageType} 메시지를 서버로 전송합니다.`);
            client.write(buffer);
        });

        // 서버 응답 처리
        client.on("data", (data) => {
            console.log("서버 응답:", data.toString());
            client.destroy(); // 응답 수신 후 연결 종료
        });

        client.on("close", () => {
            console.log("연결 종료");
        });

        client.on("error", (err) => {
            console.error("오류 발생:", err.message);
        });
    } catch (error) {
        console.error("패킷 전송 실패:", error.message);
    }
}

// 사용 예제
(async () => {
    const messageType = "C_Register"; // 전송할 메시지 타입
    const payload = {
        account: "testPlayer",
        password: "testPassword",
    };
    const packetType = PACKET_ID.C_Register; // 패킷 타입

    await loadProtoAndSend(packetType, messageType, payload);
})();
