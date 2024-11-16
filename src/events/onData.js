import config from '../config/config.js';

const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = config.packet.length + config.packet.typeLength;
  
  while (socket.buffer.length >= totalHeaderLength) {

    const packetLength = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.length);

    if (socket.buffer.length >= packetLength) {
      const packet = socket.buffer.subarray(totalHeaderLength, packetLength);
      socket.buffer = socket.buffer.subarray(packetLength);
      try {
          // const handler = getHandlerById(packetType);

          // if(!handler)
          //   throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID);

          // await handler(socket, packet);
        
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
