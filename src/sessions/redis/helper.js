export const tryGetValue = (redisObject) => {
  if (!redisObject || Object.keys(redisObject).length === 0) {
    return null;
  }
  return redisObject;
};
