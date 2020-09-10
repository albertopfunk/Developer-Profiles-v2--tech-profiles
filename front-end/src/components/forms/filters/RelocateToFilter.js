import React from "react";

import Combobox from "../combobox";
import { httpClient } from "../../../global/helpers/http-requests";

function RelocateToFilter(props) {
  async function onInputChange(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return [];
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
      isUsingRelocateToFilter: true,
      chosenRelocateToObj,
    });
  }

  function resetLocationFilter(chosenRelocateToArr) {
    if (chosenRelocateToArr.length === 0) {
      props.updateUsers({
        isUsingRelocateToFilter: false,
      });
      return;
    }

    let chosenRelocateToObj = convertToObj(chosenRelocateToArr);

    props.updateUsers({
      isUsingRelocateToFilter: true,
      chosenRelocateToObj,
    });
  }

  return (
    <section>
      <Combobox
        onInputChange={onInputChange}
        onChosenOption={onChosenLocation}
        onRemoveChosenOption={resetLocationFilter}
        inputName={"interested-locations"}
        displayName={"Interested Locations"}
      />
    </section>
  );
}

export default RelocateToFilter;
