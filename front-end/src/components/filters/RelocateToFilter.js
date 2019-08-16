import React from "react";

import LocationAutoComplete from "./LocationAutoComplete";

function RelocateToFilter(props) {
  async function onChosenLocation(chosenRelocateTo) {
    await props.setStateAsync({
      usersPage: 1,
      isUsingRelocateToFilter: true,
      chosenRelocateTo,
      isUsingSortByChoice: true
    });
    props.loadUsers(false);
  }

  async function resetLocationFilter() {
    await props.setStateAsync({
      isUsingRelocateToFilter: false
    });
    props.loadUsers(false);
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
