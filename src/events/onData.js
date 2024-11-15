import config from '../config/config.js';

const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    // 4 bytes
    const length = socket.buffer.readUInt32BE(0);
    // 1 bytes
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);

      try {
        // 일단 핑 쓸 거니까 switch
        switch (packetType) {
          case PACKET_TYPE.PING: {
            // const protoMessages = getProtoMessages();
            // const Ping = protoMessages.common.Ping;
            // const pingMessage = Ping.decode(packet);
            // const user = getUserBySocket(socket);
            // if (!user) {
            //   throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
            // }

            // user.handlePong(pingMessage);

            break;
          }
          case PACKET_TYPE.NORMAL: {
            // 패킷 구조 확인 필수
            // const { handlerId, sequence, payload, userId } = packetParser(packet);

            // const user = getUserById(userId);
            // if (user && user.sequence !== sequence) {
            //   throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
            // }

            // const handler = getHandlerById(handlerId);
            // await handler({
            //   socket,
            //   userId,
            //   payload,
            // });

            break;
          }
        }
      } catch (err) {
        // handleError(socket, err);
        console.error(err);
      }
    } else {
      break;
    }
  }
};

export default onData;
