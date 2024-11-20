const createParty = async (id, userId) => {
  const party = {
    id: id,
    userId: userId,
  };

  const partyKey = `party:${userId}`;
  await redis.hmset(partyKey, {
    id: id,
    userId: userId,
  });

  return party;
};
