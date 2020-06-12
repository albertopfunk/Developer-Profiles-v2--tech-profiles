import React from "react";

import AutoComplete from "../autocomplete/AutoComplete";

function RelocateToFilter(props) {
  function convertToObj(arr) {
    return arr.reduce((accumilator, current) => {
      accumilator[current.name] = current;
      return accumilator;
    }, {});
  }

  function onChosenLocation(chosenRelocateToArr) {
    let chosenRelocateToObj = convertToObj(chosenRelocateToArr);
    props.updateUsers({
      usersPage: 1,
      isUsingRelocateToFilter: true,
      chosenRelocateToObj
    });
  }

  function resetLocationFilter(chosenRelocateToArr) {
    if (chosenRelocateToArr.length === 0) {
      props.updateUsers({
        isUsingRelocateToFilter: false
      });
      return;
    }

    let chosenRelocateToObj = convertToObj(chosenRelocateToArr);

    props.updateUsers({
      isUsingRelocateToFilter: true,
      chosenRelocateToObj
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
