export const townSession = {
  users: [],
};

export const addUserToTownSession = (user) => {
  if (!townSession.users.find((u) => u.id === user.id)) {
    townSession.users.push(user);
  }
};
export const removeUserFromTownSession = (userId) => {
  townSession.users = townSession.users.filter((user) => user.id !== userId);
};
export const getAllUsersInTownSession = () => {
  return townSession.users;
};
