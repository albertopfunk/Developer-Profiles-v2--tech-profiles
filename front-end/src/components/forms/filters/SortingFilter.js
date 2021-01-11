import React, { useState } from "react";

// Tests
function SortingFilter(props) {
  const [currentValue, setCurrentValue] = useState("acending(oldest-newest)");

  function sortUsers(sortChoice) {
    if (currentValue === sortChoice) {
      return;
    }
    setCurrentValue(sortChoice);
    props.updateUsers({
      sortChoice,
    });
  }

  return (
    <fieldset>
      <legend>Sort Profiles</legend>
      <label htmlFor="sorting-select">Sort By:</label>
      <select
        id="sorting-select"
        data-filter-content="true"
        onClick={(e) => sortUsers(e.target.value)}
        onBlur={(e) => sortUsers(e.target.value)}
      >
        <option value="acending(oldest-newest)">acending(oldest-newest)</option>
        <option value="descending(newest-oldest)">
          descending(newest-oldest)
        </option>
      </select>
    </fieldset>
  );
}

export default SortingFilter;
