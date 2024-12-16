import { PACKET_ID } from "../../configs/constants/packetId.js";
import { addUserForTown, getAllUserByTown, getAllUserUUIDByTown } from "../../sessions/town.session.js";
import createNotificationPacket from "../notification/createNotification.js";
import createResponse from "../packet/createResponse.js";
import { enqueueSend } from "../socket/messageQueue.js";

const spawnPlayerTown = (socket, user, playerPayload) => {    
    let buffer = createResponse(PACKET_ID.S_Enter, playerPayload);
    addUserForTown(user);
    enqueueSend(socket.UUID, buffer);
    const allUUID = getAllUserUUIDByTown();
  if (allUUID.length > 1) {
      const players = [];
      for (const [_, user] of getAllUserByTown()) {
          players.push({
              playerId: user.id,
              nickname: user.nickname,
              class: user.myClass,
              transform: user.transform,
            });
        }
        
        const spawnPayload = {
            players,
        };
        
        createNotificationPacket(PACKET_ID.S_Spawn, spawnPayload, allUUID);
    }
}

export default spawnPlayerTown;