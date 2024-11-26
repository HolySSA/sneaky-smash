import Dungeon from '../classes/model/dungeon.class.js';
import { getGameAssets } from '../init/loadAsset.js';
import { dungeonSessions } from './sessions.js';

const addDungeonSession = (dungeonId) => {
  if (dungeonSessions.has(dungeonId)) {
    throw new Error('세션 중복');
  }

  const gameAssets = getGameAssets();
  const dungeonInfo = gameAssets.dungeonInfo.dungeons.find(
    (dungeon) => dungeon.dungeonId === dungeonId,
  );

  if (!dungeonInfo) {
    throw new Error('던전 정보가 존재하지 않습니다.');
  }

  const dungeon = new Dungeon(dungeonInfo);
  dungeonSessions.set(dungeonId, dungeon);

  return dungeon;
};

const getDungeonSession = (dungeonId) => {
  return dungeonSessions.get(dungeonId);
};

const removeDungeonSession = (dungeonId) => {
  return dungeonSessions.delete(dungeonId);
};

const getDungeonSessions = () => {
  return dungeonSessions;
};

export { addDungeonSession, getDungeonSession, removeDungeonSession, getDungeonSessions };
