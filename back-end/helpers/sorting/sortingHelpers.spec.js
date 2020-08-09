const sortingHelpers = require("./sortingHelpers");

describe("sortUsers", () => {
  it("should sort users by acending", () => {
    const users = [
      { id: 103 },
      { id: 104 },
      { id: 101 },
      { id: 105 },
      { id: 102 },
    ];
    const sortedUsers = sortingHelpers.sortUsers(
      users,
      "acending(oldest-newest)"
    );
    expect(sortedUsers[0].id).toBe(101);
  });

  it("should sort users by descending", () => {
    const users = [
      { id: 101 },
      { id: 103 },
      { id: 104 },
      { id: 102 },
      { id: 105 },
    ];
    const sortedUsers = sortingHelpers.sortUsers(
      users,
      "descending(newest-oldest)"
    );
    expect(sortedUsers[0].id).toBe(105);
  });
});
