import { getRedis } from '../../utils/redis/redisManager.js';
import configs from '../../configs/configs.js';

const { ServerUUID } = configs;
const PARTY_KEY = `${ServerUUID}:party`;
const PARTY_INFO_KEY = `${PARTY_KEY}:info`;
const PARTY_LIST_KEY = `${ServerUUID}:partyList`;

const addRedisParty = async (roomId, dungeonLevel, userId) => {
  const redis = await getRedis();
  const partyKey = `${PARTY_KEY}:${roomId}`;
  const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

  const existingParty = await redis.exists(partyKey);
  if (existingParty) {
    throw new Error('이미 존재하는 레디스 파티입니다.');
  }

  // 파티 생성
  await redis.sadd(partyKey, userId);
  // 파티 리스트
  await redis.sadd(PARTY_LIST_KEY, roomId);
  // 파티 던전 난이도
  await redis.hset(infoKey, {
    dungeonLevel: dungeonLevel,
    owner: userId,
  });

  const party = {
    roomId: parseInt(roomId),
    members: [userId],
    dungeonLevel: parseInt(dungeonLevel),
    owner: userId,
  };

  return party;
};

const removeRedisParty = async (roomId) => {
  const redis = await getRedis();
  const partyKey = `${PARTY_KEY}:${roomId}`;
  const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

  const existingParty = await redis.exists(partyKey);
  if (!existingParty) {
    throw new Error('존재하지 않는 레디스 파티입니다.');
  }

  // 멤버 제거
  await redis.unlink(partyKey);
  // info 제거
  await redis.unlink(infoKey);
  // 파티 리스트에서 제거
  await redis.srem(PARTY_LIST_KEY, roomId);
};

const joinRedisParty = async (roomId, userId) => {
  const redis = await getRedis();
  const partyKey = `${PARTY_KEY}:${roomId}`;
  const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

  const exists = await redis.exists(partyKey);
  if (!exists) {
    throw new Error('존재하지 않는 파티입니다.');
  }

  const addUser = await redis.sadd(partyKey, userId);
  if (!addUser) {
    throw new Error('이미 파티에 존재합니다.');
  }

  const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

  const updatedParty = {
    roomId: parseInt(roomId),
    members: members.map((m) => m.toString()),
    dungeonLevel: parseInt(info.dungeonLevel),
  };

  return updatedParty;
};

const leaveRedisParty = async (roomId, userId) => {
  const redis = await getRedis();
  const partyKey = `${PARTY_KEY}:${roomId}`;
  const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

  const removeUser = await redis.srem(partyKey, userId);
  if (removeUser === 0) {
    throw new Error('파티에 존재하지 않는 유저입니다.');
  }

  const [remainingMembers, info] = await Promise.all([
    redis.smembers(partyKey),
    redis.hgetall(infoKey),
  ]);

  return {
    roomId: parseInt(roomId),
    members: remainingMembers.map((m) => m.toString()),
    dungeonLevel: parseInt(info.dungeonLevel),
  };
};

const getRedisParty = async (roomId) => {
  const redis = await getRedis();
  const partyKey = `${PARTY_KEY}:${roomId}`;
  const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

  const exists = await redis.exists(partyKey);
  if (!exists) {
    throw new Error('존재하지 않는 파티입니다.');
  }

  const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

  const party = {
    roomId: parseInt(roomId),
    members: members.map((m) => m.toString()),
    dungeonLevel: parseInt(info.dungeonLevel),
    owner: info.owner.toString(),
  };

  return party;
};

const getRedisPartyByUserId = async (userId) => {
  const redis = await getRedis();
  const roomIds = await redis.smembers(PARTY_LIST_KEY);

  for (const roomId of roomIds) {
    const partyKey = `${PARTY_KEY}:${roomId}`;
    const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

    const isMember = await redis.sismember(partyKey, userId);

    if (isMember) {
      const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

      return {
        roomId: parseInt(roomId),
        members: members.map((m) => m.toString()),
        dungeonLevel: parseInt(info.dungeonLevel),
        owner: info.owner.toString(),
      };
    }
  }

  return null;
};

const getRedisParties = async () => {
  const redis = await getRedis();
  const roomIds = await redis.smembers(PARTY_LIST_KEY);

  const parties = await Promise.all(
    roomIds.map(async (roomId) => {
      const partyKey = `${PARTY_KEY}:${roomId}`;
      const infoKey = `${PARTY_INFO_KEY}:${roomId}`;
      const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

      return {
        roomId: parseInt(roomId),
        members: members.map((m) => m.toString()),
        dungeonLevel: parseInt(info.dungeonLevel),
        owner: info.owner,
      };
    }),
  );

  return parties;
};

export {
  addRedisParty,
  removeRedisParty,
  joinRedisParty,
  leaveRedisParty,
  getRedisParty,
  getRedisPartyByUserId,
  getRedisParties,
};
