import React from "react";

// Tests
// fires when <select> option changes, passing the value of the option
// correct value(sortByChoice) is being passed to updateUsers
function SortingFilter(props) {
  function sortUsers(sortByChoice) {
    props.updateUsers({
      usersPage: 1,
      sortByChoice,
      isUsingSortByChoice: true
    });
  }

  return (
    <section>
      <label htmlFor="sorting-select">Sort By:</label>
      {/* eslint-disable-next-line */}
      <select
        id="sorting-select"
        onChange={e => sortUsers(e.target.value)}
        // onBlur={e => props.sortUsers(e.target.value)}
      >
        <option value="acending(oldest-newest)">acending(oldest-newest)</option>
        <option value="descending(newest-oldest)">
          descending(newest-oldest)
        </option>
      </select>
    </section>
  );
}

export default SortingFilter;
