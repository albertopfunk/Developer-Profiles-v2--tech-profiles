import React from "react";
import axios from "axios";

import AutoComplete from "../autocomplete/AutoComplete";

function RelocateToFilter(props) {
  async function locationsInputChange(value) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/autocomplete`,
        { locationInput: value }
      );

      const predictions = response.data.predictions.map(location => {
        return {
          name: location.description,
          id: location.place_id
        };
      });

      return predictions;
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
      return [];
    }
  }

  function onChosenLocation(chosenRelocateToArr) {
    props.updateUsers({
      usersPage: 1,
      isUsingRelocateToFilter: true,
      chosenRelocateToArr,
      isUsingSortByChoice: true
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
        inputChangeFunc={locationsInputChange}
        onChosenInput={onChosenLocation}
        resetInputFilter={resetLocationFilter}
        inputName={"interested-locations"}
      />
    </section>
  );
}

export default RelocateToFilter;
