import React from "react";
import { httpClient } from "../http-requests";

import AutoComplete from "../autocomplete/AutoComplete";

class CurrentLocationFilter extends React.Component {
  state = {
    milesWithinInput: 5,
    chosenLocationName: "",
    chosenLocationId: ""
  };

  onInputChange = e => {
    this.setState({ milesWithinInput: e.target.value });
  };

  chooseDistanceOnKeyUp = e => {
    if (
      e.keyCode !== 37 &&
      e.keyCode !== 38 &&
      e.keyCode !== 39 &&
      e.keyCode !== 40
    ) {
      return;
    }
    this.onDistanceChange();
  };

  onDistanceChange = () => {
    if (!this.state.chosenLocationName) {
      return;
    }

    this.onChosenLocation(
      this.state.chosenLocationName,
      this.state.chosenLocationId,
      true
    );
  };

  onChosenLocation = async (name, id, distChange) => {
    if (!distChange) {
      this.setState({ chosenLocationName: name, chosenLocationId: id });
    }

    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.props.updateUsers({
      usersPage: 1,
      isUsingCurrLocationFilter: true,
      selectedWithinMiles: +this.state.milesWithinInput,
      chosenLocationLat: res.data.lat,
      chosenLocationLon: res.data.lng
    });
  };

  resetLocationFilter = () => {
    this.props.updateUsers({
      isUsingCurrLocationFilter: false
    });
    this.setState({ chosenLocationName: "", chosenLocationId: "" });
  };

  render() {
    return (
      <section>
        <div className="miles">
          <label htmlFor="choose-miles">
            Select Distance
            <input
              type="range"
              min="5"
              max="2000"
              step="5"
              id="choose-miles"
              name="milesWithinInput"
              value={this.state.milesWithinInput}
              onChange={this.onInputChange}
              onMouseUp={this.onDistanceChange}
              onKeyUp={this.chooseDistanceOnKeyUp}
            />
            {this.state.milesWithinInput}
          </label>
        </div>
        <AutoComplete
          onChosenInput={this.onChosenLocation}
          resetInputFilter={this.resetLocationFilter}
          inputName={"current-location"}
          single
        />
      </section>
    );
  }
}

export default CurrentLocationFilter;
