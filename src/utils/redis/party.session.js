const createParty = async (id, dungeonLevel, userId) => {
  const partyKey = `party:${id}`;

  // 파티 생성
  await redis.sadd(partyKey, userId);
  // 파티 리스트
  await redis.sadd('partyList', id);
  // 파티 던전 난이도
  await redis.hset(`party:${id}:info`, 'dungeonLevel', dungeonLevel, 'owner', userId);

  const party = {
    roomId: id,
    members: [userId],
    dungeonLevel,
  };

  return party;
};

const removeParty = async (id) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  // 멤버 제거
  await redis.del(partyKey);
  // info 제거
  await redis.del(infoKey);
  await redis.srem('partyList', id);
};

const joinParty = async (id, userId) => {
  const partyKey = `party:${id}`;

  await redis.sadd(partyKey, userId);

  const members = await redis.smembers(partyKey);

  const updatedParty = {
    roomId: id,
    members: members,
  };

  return updatedParty;
};

const leaveParty = async (id, userId) => {
  const partyKey = `party:${id}`;

  // 유저 제거
  const removed = await redis.srem(partyKey, userId);

  // 제거 실패 - 해당 유저 없을 경우
  if (removed === 0) {
    return;
  }

  // 남아있는 멤버 조회
  const remainingMembers = await redis.smembers(partyKey);

  return remainingMembers;
};

const getParty = async (id) => {
  const partyKey = `party:${id}`;
  const infoKey = `party:${id}:info`;

  // 파티 멤버 조회
  const members = await redis.smembers(partyKey);
  // 파티 정보
  const info = await redis.hgetall(infoKey);

  const party = {
    roomId: id,
    members,
    dungeonLevel: info.dungeonLevel ? parseInt(info.dungeonLevel, 10) : null,
    owner: info.owner ? parseInt(info.dungeonLevel, 10) : null,
  };

  return party;
};

const getAllParties = async () => {
  const roomIds = await redis.smembers('partyList');

  // 각 파티 멤버 정보 가져오기
  const parties = await Promise.all(
    roomIds.map(async (roomId) => {
      const members = await redis.smembers(`party:${roomId}`);
      const info = `party:${roomId}:info`;

      return {
        roomId: roomId,
        members: members,
        dungeonLevel: info.dungeonLevel,
      };
    }),
  );

  return parties;
};

export { createParty, joinParty, leaveParty, getParty, getAllParties, removeParty };
