import React from "react";

import AutoComplete from "../autocomplete/AutoComplete";

function RelocateToFilter(props) {
  function onChosenLocation(chosenRelocateToArr) {
    props.updateUsers({
      usersPage: 1,
      isUsingRelocateToFilter: true,
      chosenRelocateToArr
    });
  }

  function resetLocationFilter(chosenRelocateToArr) {
    if (chosenRelocateToArr.length === 0) {
      props.updateUsers({
        isUsingRelocateToFilter: false
      });
      return;
    }

    props.updateUsers({
      isUsingRelocateToFilter: true,
      chosenRelocateToArr
    });
  }

  return (
    <section>
      <AutoComplete
        onChosenInput={onChosenLocation}
        resetInputFilter={resetLocationFilter}
        inputName={"interested-locations"}
      />
    </section>
  );
}

export default RelocateToFilter;
