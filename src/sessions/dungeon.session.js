import Dungeon from '../classes/model/dungeon.class.js';
import { getGameAssets } from '../init/loadAsset.js';
import { dungeonSessions } from './sessions.js';
import logger from '../utils/logger.js';

const addDungeonSession = (sessionId, dungeonLevel) => {
  if (dungeonSessions.has(sessionId)) {
    throw new Error('세션 중복');
  }

  const dungeonCode = 1;

  const dungeonAssets = getGameAssets().dungeonInfo; // 맵핑된 던전 데이터 가져오기
  const dungeonInfo = dungeonAssets[dungeonCode]; // ID로 바로 접근
  
  if (!dungeonInfo) {
    logger.error(`던전 정보를 찾을 수 없습니다. dungeonCode: ${dungeonCode}`);
    return null;
  }

  const dungeon = new Dungeon(dungeonInfo, dungeonLevel);
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

const getStatsByUserClass = (userClass) => {
const classAssets = getGameAssets().classInfo;
const classInfos = classAssets[userClass];

if (!classInfos) {
  logger.error(`Class 정보를 찾을 수 없습니다. classId: ${userClass}`);
  return null;
}

const expAssets = getGameAssets().expInfo;
const expInfos = expAssets[1];

if (!expInfos) {
  logger.error('레벨 1의 경험치 정보를 찾을 수 없습니다.');
  return null;
}

  return {
    Level : 1,
    stats: classInfos.stats,
    exp: 0,
    maxExp : expInfos.maxExp,
  };
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
  getStatsByUserClass
};
