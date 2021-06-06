import React, { useState } from "react";

import Combobox from "../combobox";
import { httpClient } from "../../../global/helpers/http-requests";

function RelocateToFilter(props) {
  const [interestedLocations, setInterestedLocations] = useState([]);

  async function onInputChange(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location results" };
    }

    let checkDups = {};
    for (let i = 0; i < interestedLocations.length; i++) {
      checkDups[interestedLocations[i].name] = true;
    }
    const results = res.data.filter(
      (prediction) => !(prediction.name in checkDups)
    );

    return results;
  }

  function convertToObj(arr) {
    return arr.reduce((accumilator, current) => {
      accumilator[current.name] = current;
      return accumilator;
    }, {});
  }

  function onLocationChange(chosenRelocateToArr) {
    setInterestedLocations(chosenRelocateToArr);

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
    <fieldset>
      <legend>Filter by Interested Locations</legend>
      <Combobox
        chosenOptions={interestedLocations}
        onInputChange={onInputChange}
        onChosenOption={onLocationChange}
        onRemoveChosenOption={onLocationChange}
        inputName={"interested-locations"}
        displayName={"Interested Locations"}
      />
    </fieldset>
  );
}

export default RelocateToFilter;
