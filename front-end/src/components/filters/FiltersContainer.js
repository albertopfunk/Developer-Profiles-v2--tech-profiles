import React from "react";
// import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function FiltersContainer(props) {
  return (
    <aside>
      <SortingFilter updateUsers={props.updateUsers} />
      <AreaOfWorkFilter updateUsers={props.updateUsers} />
      <CurrentLocationFilter updateUsers={props.updateUsers} />
      <RelocateToFilter updateUsers={props.updateUsers} />
    </aside>
  );
}

const MemoFiltersContainer = React.memo(FiltersContainer);

export default MemoFiltersContainer;
