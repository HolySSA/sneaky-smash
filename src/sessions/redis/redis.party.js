import { getRedis } from '../../utils/redis/redisManager.js';
import configs from '../../configs/configs.js';
import { tryGetValue } from './helper.js';

const { ServerUUID } = configs;
const PARTY_KEY = `${ServerUUID}:party`;
const PARTY_INFO_KEY = `${PARTY_KEY}:info`;
const PARTY_LIST_KEY = `${ServerUUID}:partyList`;
const ENTERED_PARTY_KEY = `${ServerUUID}:enteredParty`;

const addRedisParty = async (roomId, dungeonLevel, userId) => {
  const redis = await getRedis();
  const partyKey = `${PARTY_KEY}:${roomId}`;
  const infoKey = `${PARTY_INFO_KEY}:${roomId}`;

  const existingParty = await redis.exists(partyKey);
  if (existingParty) {
    throw new Error('이미 존재하는 레디스 파티입니다.');
  }

  const enteredPartyKey = `${ENTERED_PARTY_KEY}:${userId}`;
  if (await redis.exists(enteredPartyKey)) {
    throw new Error('이미 파티에 가입되어 있습니다.');
  } else {
    await redis.set(enteredPartyKey, roomId);
    await redis.expire(enteredPartyKey, 3600);
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

  await redis.expire(partyKey, 3600);
  await redis.expire(PARTY_LIST_KEY, 3600);
  await redis.expire(infoKey, 3600);

  const party = {
    roomId: roomId,
    members: [userId],
    dungeonLevel: dungeonLevel,
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
  const partyMembers = await redis.smembers(partyKey);
  for (let i = 0; i < partyMembers.length; i++) {
    await redis.unlink(`${ENTERED_PARTY_KEY}:${partyMembers[i]}`);
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

  const enteredPartyKey = `${ENTERED_PARTY_KEY}:${userId}`;
  if (await redis.exists(enteredPartyKey)) {
    throw new Error('이미 파티에 가입되어 있습니다.');
  } else {
    await redis.set(enteredPartyKey, roomId);
    await redis.expire(enteredPartyKey, 3600);
  }

  const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);
  const updatedParty = {
    roomId: roomId,
    members: members.map((m) => m.toString()),
    dungeonLevel: info.dungeonLevel,
  };

  await redis.expire(partyKey, 3600);
  await redis.expire(infoKey, 3600);

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

  const enteredPartyKey = `${ENTERED_PARTY_KEY}:${userId}`;
  await redis.unlink(enteredPartyKey);
  await redis.expire(partyKey, 3600);
  await redis.expire(infoKey, 3600);

  return {
    roomId: roomId,
    members: remainingMembers.map((m) => m.toString()),
    dungeonLevel: info.dungeonLevel,
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
    roomId: roomId,
    members: members.map((m) => m.toString()),
    dungeonLevel: info.dungeonLevel,
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
        roomId,
        members,
        dungeonLevel: info.dungeonLevel,
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
        roomId: roomId,
        members: members.map((m) => m.toString()),
        dungeonLevel: info.dungeonLevel,
        owner: info.owner,
      };
    }),
  );

  return parties;
};

const getRedisUUIDbyMembers = async (members) => {
  const redis = await getRedis();
  //  const userKey = `user:${userId}`;
  const UUID = [];
  for (let i = 0; i < members.length; i++) {
    const userKey = `user:${members[i]}`;
    const temp = await redis.hget(userKey, 'UUID');
    UUID.push(temp);
  }
  return UUID;
};

/*
export const setRedisUserUUID = async (socket) => {
  const redis = await getRedis();
  const userKey = `user:${socket.id}`;
  await redis.hset(userKey, "UUID", socket.UUID);
  await redis.expire(userKey, 3600);
};
*/

export {
  addRedisParty,
  removeRedisParty,
  joinRedisParty,
  leaveRedisParty,
  getRedisParty,
  getRedisPartyByUserId,
  getRedisParties,
  getRedisUUIDbyMembers,
};
