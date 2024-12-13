import Dungeon from '../classes/model/dungeon.class.js';
import { getGameAssets } from '../init/loadAsset.js';
import { dungeonSessions } from './sessions.js';

const addDungeonSession = (sessionId, dungeonLevel) => {
  if (dungeonSessions.has(sessionId)) {
    throw new Error('세션 중복');
  }

  const dungeonCode = 1;

  const gameAssets = getGameAssets().dungeonInfo;
  const dungeonInfos = gameAssets.dungeons.find(
    (dungeonInfo) => dungeonInfo.dungeonId === dungeonCode,
  );

  if (!dungeonInfos) {
    throw new Error('던전 정보가 존재하지 않습니다.');
  }

  const dungeon = new Dungeon(dungeonInfos, dungeonLevel);
  dungeonSessions.set(sessionId, dungeon);

  return dungeon;
};

export const findDungeonByUserId = (userId) => {
  let result = null;
  for (const [_, dungeon] of dungeonSessions.entries()) {
    if (dungeon.users.has(userId)) {
      result = dungeon;
      break;
    }
  }
  return result;
};

const getDungeonSession = (dungeonId) => {
  return dungeonSessions.get(dungeonId);
};

const getDungeonUsersUUID = (dungeonId) => {
  const session = getDungeonSession(dungeonId);

  if (!session.users || session.users.size === 0) {
    throw new Error(`던전에 유저가 존재하지 않습니다. dungeonId: ${dungeonId}`);
  }

  return Array.from(session.users.values()).map((user) => user.user.socket.UUID);
};

const removeDungeonSession = (dungeonId) => {
  if (!dungeonSessions.has(dungeonId)) {
    throw new Error(`던전 세션이 존재하지 않습니다.`);
  }

  return dungeonSessions.delete(dungeonId);
};

const getDungeonSessions = () => {
  return dungeonSessions;
};

export {
  addDungeonSession,
  getDungeonSession,
  removeDungeonSession,
  getDungeonSessions,
  getDungeonUsersUUID,
};
