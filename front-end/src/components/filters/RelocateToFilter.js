import React from "react";

import LocationAutoComplete from "./LocationAutoComplete";

function RelocateToFilter(props) {
  async function onChosenLocation(chosenRelocateTo) {
    await props.setStateAsync({
      usersPage: 1,
      chosenRelocateTo,
      isUsingSortByChoice: true,
      isUsingRelocateToFilter: true
    });
    props.loadUsers();
  }

  async function resetLocationFilter() {
    await props.setStateAsync({
      isUsingRelocateToFilter: false
    });
    props.loadUsers();
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
