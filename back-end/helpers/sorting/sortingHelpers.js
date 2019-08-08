/*eslint no-console: ["error", { allow: ["error"] }] */
module.exports = {
  sortUsers
};

function sortUsers(users, sortByChoice) {
  let sortedUsers;

  if (sortByChoice === "acending(oldest-newest)") {
    sortedUsers = users.sort(function(a, b) {
      return a.id - b.id;
    });
  }

  if (sortByChoice === "descending(newest-oldest)") {
    sortedUsers = users.sort(function(a, b) {
      return b.id - a.id;
    });
  }

  return sortedUsers;
}
