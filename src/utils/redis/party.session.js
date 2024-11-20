const createParty = async (socket, id) => {
  const partyKey = `party:${user.id}`;
  await redis.hmset(userKey, {
    socket,
    id: id,
  });

  return user;
};
