import React from "react";

import AutoComplete from "../autocomplete/AutoComplete";
import { httpClient } from "../http-requests";

function RelocateToFilter(props) {
  async function onInputChange(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return false;
    }

    return res.data;
  }

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
        onInputChange={onInputChange}
        onChosenInput={onChosenLocation}
        resetInputFilter={resetLocationFilter}
        inputName={"interested-locations"}
      />
    </section>
  );
}

export default RelocateToFilter;
