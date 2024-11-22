import redis from '../../utils/redis/redisManager.js';

const addRedisParty = async (id, dungeonLevel, userId) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  // 파티 생성
  await redis.sadd(partyKey, userId.toString());
  // 파티 리스트
  await redis.sadd('partyList', id.toString());
  // 파티 던전 난이도
  await redis.hset(infoKey, {
    dungeonLevel: dungeonLevel.toString(),
    owner: userId.toString(),
  });

  const party = {
    roomId: id.toString(),
    members: [userId.toString()],
    dungeonLevel: parseInt(dungeonLevel),
    owner: userId.toString(),
  };

  return party;
};

const removeRedisParty = async (id) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  // 멤버 제거
  await redis.del(partyKey);
  // info 제거
  await redis.del(infoKey);
  // 파티 리스트에서 제거
  await redis.srem('partyList', id.toString());
};

const joinRedisParty = async (id, userId) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  const exists = await redis.exists(partyKey);
  if (!exists) {
    throw new Error('존재하지 않는 파티입니다.');
  }

  const addUser = await redis.sadd(partyKey, userId.toString());
  if (!addUser) {
    throw new Error('이미 파티에 존재합니다.');
  }

  const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

  const updatedParty = {
    roomId: id.toString(),
    members: members.map((m) => m.toString()),
    dungeonLevel: parseInt(info.dungeonLevel),
  };

  return updatedParty;
};

const leaveRedisParty = async (id, userId) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  const removeUser = await redis.srem(partyKey, userId.toString());
  if (removeUser === 0) {
    throw new Error('파티에 존재하지 않는 유저입니다.');
  }

  const [remainingMembers, info] = await Promise.all([
    redis.smembers(partyKey),
    redis.hgetall(infoKey),
  ]);

  return {
    roomId: id.toString(),
    members: remainingMembers.map((m) => m.toString()),
    dungeonLevel: parseInt(info.dungeonLevel),
  };
};

const getRedisParty = async (id) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  const exists = await redis.exists(partyKey);
  if (!exists) {
    throw new Error('존재하지 않는 파티입니다.');
  }

  const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

  const party = {
    roomId: id.toString(),
    members: members.map((m) => m.toString()),
    dungeonLevel: parseInt(info.dungeonLevel),
    owner: info.owner.toString(),
  };

  return party;
};

const getRedisParties = async () => {
  const roomIds = await redis.smembers('partyList');

  const parties = await Promise.all(
    roomIds.map(async (roomId) => {
      const partyKey = `party:${roomId}`;
      const infoKey = `party:${roomId}:info`;

      const [members, info] = await Promise.all([redis.smembers(partyKey), redis.hgetall(infoKey)]);

      return {
        roomId: roomId.toString(),
        members: members.map((m) => m.toString()),
        dungeonLevel: parseInt(info.dungeonLevel),
        owner: info.owner.toString(),
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
  getRedisParties,
};
