import React, { useState } from "react";

// Tests
function SortingFilter(props) {
  const [currentValue, setCurrentValue] = useState("acending(oldest-newest)");

  function sortUsers(sortByChoice) {
    if (currentValue === sortByChoice) {
      return;
    }
    setCurrentValue(sortByChoice);
    props.updateUsers({
      usersPage: 1,
      sortByChoice,
      isUsingSortByChoice: true
    });
  }

  return (
    <section>
      <label htmlFor="sorting-select">Sort By:</label>
      <select
        id="sorting-select"
        onClick={e => sortUsers(e.target.value)}
        onBlur={e => sortUsers(e.target.value)}
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
