import React from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function Filters(props) {
  return (
    <Aside id="filters" tabIndex="-1">
      <SortingFilter updateUsers={props.updateUsers} />
      <AreaOfWorkFilter updateUsers={props.updateUsers} />
      <CurrentLocationFilter updateUsers={props.updateUsers} />
      <RelocateToFilter updateUsers={props.updateUsers} />
    </Aside>
  );
}

const Aside = styled.aside`
  border: solid yellow;
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
