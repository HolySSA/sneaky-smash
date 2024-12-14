// gameAssets.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');
let gameAssets = {}; // 전역함수로 선언

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        logger.error(`${filename} 파일을 읽는 데 실패했습니다:`, err);
        reject(err);
        return;
      }
      // logger.info(`${filename} 파일이 성공적으로 로드되었습니다.`);
      resolve(JSON.parse(data));
    });
  });
};

const transformToMap = (array, key, tableName) => {
  return array.reduce((map, item, index) => {
    const { [key]: id, ...rest } = item; // ID를 Key로 설정하고 제거
    if (id === undefined || id === null) {
      logger.warn(`${tableName} 데이터에 키(${key})가 없습니다.`, { index, item });
      return map;
    }
    if (Object.keys(rest).length === 0) {
      logger.warn(`${tableName} 데이터에서 값이 비어 있습니다.`, { index, id, item });
      return map;
    }
    map[id] = rest;
    return map;
  }, {});
};

const transformNestedData = (array, key, subKey, subTransformKey, tableName) => {
  return array.reduce((map, item) => {
    const { [key]: id, ...rest } = item;
    if (!id || !rest) {
      logger.warn(`${tableName}에서 키 또는 값이 누락되었습니다.`, { id, rest });
    }
    map[id] = {
      ...rest,
      [subKey]: transformToMap(item[subKey], subTransformKey, `${tableName} -> ${subKey}`)
    };
    return map;
  }, {});
};

const transformGameAssets = (assets) => {
  const transformedAssets = {
    ...assets,
    item: transformToMap(assets.item.data, 'itemId', 'item'),
    monster: transformToMap(assets.monster.data, 'monsterId', 'monster'),
    equipment: transformToMap(assets.equipment.data, 'id', 'equipment'),
    classInfo: transformToMap(assets.classInfo.data, 'classId', 'classInfo'),
    dungeonInfo: transformNestedData(assets.dungeonInfo.data, 'dungeonId', 'stages', 'stageId', 'dungeonInfo'),
    projectile: transformToMap(assets.projectile.data, 'projectileId', 'projectile'),
    skillInfo: transformToMap(assets.skillInfo.data, 'skillId', 'skillInfo'),
    levelperStats: transformToMap(assets.levelperStats.data, 'classId', 'levelperStats'),
    expInfo: transformToMap(assets.expInfo.data, 'level', 'expInfo'),
    spawnTimeInfo: transformToMap(assets.spawnTimeInfo.data, 'level', 'spawnTimeInfo'),
  };

  // Object.entries(transformedAssets).forEach(([key, value]) => {
  //   logger.info(`맵핑된 ${key} 데이터 검증:`);
  //   Object.entries(value).forEach(([subKey, subValue]) => {
  //     logger.info(`  키: ${subKey}, 밸류: ${JSON.stringify(subValue)}`);
  //   });
  // });

  return transformedAssets;
};

const loadGameAssets = async () => {
  try {
    const [
      dungeonInfo,
      equipment,
      item,
      monster,
      classInfo,
      levelperStats,
      skillInfo,
      projectile,
      expInfo,
      spawnTimeInfo,
    ] = await Promise.all([
      readFileAsync('dungeonInfo.json'),
      readFileAsync('equipment.json'),
      readFileAsync('item.json'),
      readFileAsync('monster.json'),
      readFileAsync('classInfo.json'),
      readFileAsync('levelperStats.json'),
      readFileAsync('skill.json'),
      readFileAsync('projectile.json'),
      readFileAsync('userExp.json'),
      readFileAsync('userSpawnTime.json'),
    ]);

    logger.info('모든 게임 데이터가 성공적으로 로드되었습니다.');

    gameAssets = transformGameAssets({
      dungeonInfo,
      equipment,
      item,
      monster,
      classInfo,
      levelperStats,
      skillInfo,
      projectile,
      expInfo,
      spawnTimeInfo,
    });

    return gameAssets;
  } catch (error) {
    logger.error('게임 데이터를 로드하는 데 실패했습니다:', error);
    throw new Error('게임 데이터를 로드하는 데 실패했습니다: ' + error.message);
  }
};

const getGameAssets = () => {
  return gameAssets;
};

export { loadGameAssets, getGameAssets };
