import React from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./area-of-work/AreaOfWorkFilter";
import CurrentLocationFilter from "./current-location/CurrentLocationFilter";
import RelocateToFilter from "./relocate-location/RelocateToFilter";
import SortingFilter from "./sorting/SortingFilter";

function Filters(props) {
  return (
    <Aside>
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
