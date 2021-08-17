import React, { useState } from "react";
import styled from "styled-components";

import Spacer from "../../../global/helpers/spacer";

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
    <Fieldset>
      <legend>Sort Profiles</legend>
      <Spacer axis="vertical" size="15" />
      <label htmlFor="sorting-select">Sort By:</label>
      <Spacer axis="vertical" size="5" />
      <select
        id="sorting-select"
        onClick={(e) => sortUsers(e.target.value)}
        onBlur={(e) => sortUsers(e.target.value)}
      >
        <option value="acending(oldest-newest)">acending(oldest-newest)</option>
        <option value="descending(newest-oldest)">
          descending(newest-oldest)
        </option>
      </select>
    </Fieldset>
  );
}

const Fieldset = styled.fieldset`
  legend {
    width: 100%;
    padding: 2.5px 5px;
    border-bottom: var(--border-lg);
  }
`;

export default SortingFilter;
