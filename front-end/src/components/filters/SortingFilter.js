import React from "react";

function SortingFilter(props) {
  async function sortUsers(sortByChoice) {
    await props.setStateAsync({
      usersPage: 1,
      sortByChoice,
      isUsingSortByChoice: true
    });
    props.loadUsers(false);
  }

  return (
    <section>
      <label htmlFor="sorting-select">Sort Profiles:</label>
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
