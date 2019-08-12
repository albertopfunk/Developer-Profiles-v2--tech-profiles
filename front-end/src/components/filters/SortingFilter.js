import React from "react";

function SortingFilter(props) {
  return (
    <section>
      <label htmlFor="sorting-select">Sort Profiles:</label>
      {/* eslint-disable-next-line */}
      <select
        id="sorting-select"
        onChange={e => props.sortUsers(e.target.value)}
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
