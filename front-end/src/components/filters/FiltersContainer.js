import React from "react";
// import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function FiltersContainer(props) {
  return (
    <aside>
      <SortingFilter
        setStateAsync={props.setStateAsync}
        loadUsers={props.loadUsers}
      />

      <AreaOfWorkFilter
        setStateAsync={props.setStateAsync}
        loadUsers={props.loadUsers}
      />

      <CurrentLocationFilter
        setStateAsync={props.setStateAsync}
        loadUsers={props.loadUsers}
      />

      <RelocateToFilter
        setStateAsync={props.setStateAsync}
        loadUsers={props.loadUsers}
      />
    </aside>
  );
}

export default FiltersContainer;
