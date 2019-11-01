import React from "react";

import AutoComplete from "../autocomplete/AutoComplete";

function RelocateToFilter(props) {
  // Tests
  // calls updateUsers with correct chosen location to update users
  // chosenRelocateTo, correct chosen location name
  // usersPage: 1, resets page to 1 when updating users
  // isUsingRelocateToFilter: true, filters users based on this filter being on
  // isUsingSortByChoice: true, each filter turns this on to correctly sort filtered users
  function onChosenLocation(chosenRelocateToArr) {
    props.updateUsers({
      usersPage: 1,
      isUsingRelocateToFilter: true,
      chosenRelocateToArr,
      isUsingSortByChoice: true
    });
  }

  // Tests
  // calls updateUsers to update users
  // isUsingRelocateToFilter: false, filters users based on this filter being off
  function resetLocationFilter(chosenRelocateToArr) {
    if (chosenRelocateToArr) {
      props.updateUsers({
        isUsingRelocateToFilter: true,
        chosenRelocateToArr
      });
      return;
    }
    props.updateUsers({
      isUsingRelocateToFilter: false
    });
  }

  return (
    <section>
      <AutoComplete
        onChosenInput={onChosenLocation}
        resetInputFilter={resetLocationFilter}
        locations
      />
    </section>
  );
}

export default RelocateToFilter;
