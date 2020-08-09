module.exports = {
  sortUsers,
};

function sortUsers(users, sortChoice) {
  let sortedUsers;

  if (sortChoice === "acending(oldest-newest)") {
    sortedUsers = users.sort(function (a, b) {
      return a.id - b.id;
    });
  }

  if (sortChoice === "descending(newest-oldest)") {
    sortedUsers = users.sort(function (a, b) {
      return b.id - a.id;
    });
  }

  return sortedUsers;
}
