const createParty = async (id, userId) => {
  const partyKey = `party:${id}`;

  // 파티 생성
  await redis.sadd(partyKey, userId);
  // 파티 리스트
  await redis.sadd('partyList', id);

  const party = {
    id: id,
    members: [userId],
  };

  return party;
};

const joinParty = async (id, userId) => {
  const partyKey = `party:${id}`;

  await redis.sadd(partyKey, userId);

  const members = await redis.smembers(partyKey);

  const updatedParty = {
    id: id,
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

  // 파티 멤버 조회
  const members = await redis.smembers(partyKey);

  return members;
};

const getAllParties = async () => {
  const partyIds = await redis.smembers('partyList');

  // 각 파티 멤버 정보 가져오기
  const parties = await Promise.all(
    partyIds.map(async (partyId) => {
      const members = await redis.smembers(`party:${partyId}`);
      return {
        id: partyId,
        members: members,
      };
    }),
  );

  return parties;
};

export { createParty, joinParty, leaveParty, getParty, getAllParties };
