import React from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";

import Combobox from "../combobox";

class CurrentLocationFilter extends React.Component {
  state = {
    milesWithinInput: 5,
    location: [],
  };

  onInputChange = (e) => {
    this.setState({ milesWithinInput: e.target.value });
  };

  onLocationInputChange = async (value) => {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location results" };
    }

    if (this.state.location.length > 0) {
      const results = res.data.filter(
        (prediction) => prediction.name !== this.state.location[0].name
      );
      return results;
    }

    return res.data;
  };

  chooseDistanceOnKeyUp = (e) => {
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
    if (this.state.location.length === 0) {
      return;
    }

    this.onChosenLocation(
      this.state.location[0].name,
      this.state.location[0].id,
      true
    );
  };

  onChosenLocation = async (name, id, distChange) => {
    if (!distChange) {
      this.setState({ location: [{ name, id }] });
    }

    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location information" };
    }

    this.props.updateUsers({
      isUsingCurrLocationFilter: true,
      selectedWithinMiles: +this.state.milesWithinInput,
      chosenLocationLat: res.data.lat,
      chosenLocationLon: res.data.lng,
    });
  };

  resetLocationFilter = () => {
    this.props.updateUsers({
      isUsingCurrLocationFilter: false,
    });
    this.setState({ location: [] });
  };

  render() {
    return (
      <fieldset>
        <legend>Filter by Current Location with Distance</legend>
        <FlexContainer>
        <div className="miles">
          <label htmlFor="choose-miles">
            {this.state.milesWithinInput} miles
          </label>
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
        </div>
        <Combobox
          chosenOptions={this.state.location}
          onInputChange={this.onLocationInputChange}
          onChosenOption={this.onChosenLocation}
          onRemoveChosenOption={this.resetLocationFilter}
          inputName={"current-location"}
          displayName={"Current Location"}
          single
          />
        </FlexContainer>
      </fieldset>
    );
  }
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export default CurrentLocationFilter;
