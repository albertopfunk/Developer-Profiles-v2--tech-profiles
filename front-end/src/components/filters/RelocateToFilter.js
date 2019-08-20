import React from "react";

import LocationAutoComplete from "./LocationAutoComplete";

function RelocateToFilter(props) {
  function onChosenLocation(chosenRelocateTo) {
    props.updateUsers({
      usersPage: 1,
      isUsingRelocateToFilter: true,
      chosenRelocateTo,
      isUsingSortByChoice: true
    });
  }

  function resetLocationFilter() {
    props.updateUsers({
      isUsingRelocateToFilter: false
    });
  }

  return (
    <section>
      <LocationAutoComplete
        onChosenLocation={onChosenLocation}
        resetLocationFilter={resetLocationFilter}
      />
    </section>
  );
}

export default RelocateToFilter;
