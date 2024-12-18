import { PACKET_ID } from '../../configs/constants/packetId.js';
import {
  addDungeonSession,
  getDungeonSession,
  getStatsByUserClass,
} from '../../sessions/dungeon.session.js';
import { getRedisParty, removeRedisParty } from '../../sessions/redis/redis.party.js';
import { getAllUserUUIDByTown } from '../../sessions/town.session.js';
import { getUserById } from '../../sessions/user.session.js';
import handleError from '../../utils/error/errorHandler.js';
import logger from '../../utils/logger.js';
import makeUUID from '../../utils/makeUUID.js';
import createNotificationPacket from '../../utils/notification/createNotification.js';

const dungeonStartHandler = async ({ socket, payload }) => {
  const dungeonId = makeUUID();

  let dungeon = null;
  try {
    const { dungeonLevel, roomId } = payload; // 클라에서 레이턴시 추가하기

    // 파티 세션
    const party = await getRedisParty(roomId);

    // 던전 세션 생성 - dungeonLevel = dungeonId = dungeonCode ???
    if (party.members.length < 2) {
      logger.warn(`2명 미만일 땐 시작할 수 없습니다. : ${JSON.stringify(party)}`);
      return;
    }

    dungeon = addDungeonSession(dungeonId, dungeonLevel);

    let transforms = dungeon.getSpawnPosition();

    for (let i = transforms.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [transforms[i], transforms[randomIndex]] = [transforms[randomIndex], transforms[i]];
    }

    const dungeonInfo = {
      dungeonCode: dungeon.dungeonId,
      dungeonName: dungeon.name,
    };

    const townUsers = getAllUserUUIDByTown();

    const playerInfo = [];
    const partyUUID = [];
    const despawnPayload = { playerIds: [] };
    for (let playerId of party.members) {
      despawnPayload.playerIds.push(playerId);
      const user = getUserById(Number(playerId));
      partyUUID.push(user.socket.UUID);
      const transformData = transforms.pop() || [0, 0, 0];
      const transform = {
        posX: transformData[0],
        posY: transformData[1],
        posZ: transformData[2],
        rot: transformData[3], // rotation 값은 나중에 받으면 수정
      };

      const statInfo = getStatsByUserClass(user.myClass);

      if (!statInfo) {
        logger.error('스탯 정보가 존재하지 않습니다');
        return;
      }

      playerInfo.push({
        playerId: user.id,
        nickname: user.nickname,
        class: user.myClass,
        transform,
        statInfo,
      });

      await dungeon.addDungeonUser(user, statInfo);
    }

    createNotificationPacket(PACKET_ID.S_Despawn, despawnPayload, townUsers);

    dungeon.monsterLogic.spawnMonsterZone();

    // 파티원 모두의 정보
    const enterDungeonPayload = {
      dungeonInfo,
      player: playerInfo,
      infoText: '',
    };

    createNotificationPacket(PACKET_ID.S_EnterDungeon, enterDungeonPayload, partyUUID);
    const partyPayload = {
      playerId: party.owner,
      roomId,
    };

    await removeRedisParty(roomId);

    createNotificationPacket(PACKET_ID.S_PartyLeave, partyPayload, getAllUserUUIDByTown());

    // 넥서스 스폰 보내는 위치
    if (!dungeon.spawnNexusNotification()) {
      logger.warn('Failed to spawn Nexus in the dungeon.');
      return;
    }
  } catch (e) {
    handleError(socket, e);
    const dungeon = getDungeonSession(dungeonId);
    if (dungeon) {
      dungeon.Dispose();
    }
  }
};

export default dungeonStartHandler;
