import React from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function Filters(props) {
  return (
    <Section id="filters" tabIndex="-1" aria-labelledby="filters-heading">
      <h2 id="filters-heading">Filters</h2>
      <p>{`Showing ${props.currentUsers} of ${props.totalUsers} Profiles`}</p>
      <SortingFilter updateUsers={props.updateUsers} />
      <AreaOfWorkFilter updateUsers={props.updateUsers} />
      <CurrentLocationFilter updateUsers={props.updateUsers} />
      <RelocateToFilter updateUsers={props.updateUsers} />
    </Section>
  );
}

const Section = styled.section`
  background-color: white;
  height: 100vh;
  width: 300px;
  position: fixed;
  left: 0;
  top: 100px;
  z-index: 5;
`;

const MemoFilters = React.memo(Filters);

export default MemoFilters;
