import React from "react";
import styled from "styled-components";

import Combobox from "../combobox";

import { httpClient } from "../../../global/helpers/http-requests";
import Spacer from "../../../global/helpers/spacer";

class CurrentLocationFilter extends React.Component {
  state = {
    inputTimeout: null,
    location: [],
    rangeInput: 30,
  };

  getLocationsByValue = async (value) => {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      if (res.err === "Zero results found") return [];
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

  debounceRangeChange = (e) => {
    const { value } = e.target;
    let currTimeOut;

    this.setState({
      rangeInput: value,
    });

    if (this.state.inputTimeout) {
      clearTimeout(this.state.inputTimeout);
    }

    currTimeOut = setTimeout(() => {
      this.setState({ inputTimeout: null });
      this.updateLocationGio();
    }, 500);

    this.setState({ inputTimeout: currTimeOut });
  };

  updateLocationGio = () => {
    if (this.state.location.length === 0) {
      return;
    }

    this.setLocationWithGio(
      this.state.location[0].name,
      this.state.location[0].id,
      true
    );
  };

  setLocationWithGio = async (name, id, rangeChange) => {
    if (!rangeChange) {
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
      selectedWithinMiles: +this.state.rangeInput,
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
      <Fieldset>
        <legend>Filter by Current Location</legend>
        <Spacer axis="vertical" size="15" />
        <FlexContainer>
          <div className="range-input-container">
            <label htmlFor="location-radius">
              {this.state.rangeInput} mile radius
            </label>
            <Spacer axis="vertical" size="5" />
            <input
              type="range"
              min="10"
              max="2000"
              step="5"
              id="location-radius"
              name="rangeInput"
              className="range-input"
              value={this.state.rangeInput}
              onChange={(e) => this.debounceRangeChange(e)}
            />
          </div>
          <Combobox
            chosenOptions={this.state.location}
            onInputChange={this.getLocationsByValue}
            onChosenOption={this.setLocationWithGio}
            onRemoveChosenOption={this.resetLocationFilter}
            inputName={"current-location"}
            displayName={"Current Location"}
            single
          />
        </FlexContainer>
      </Fieldset>
    );
  }
}

const Fieldset = styled.fieldset`
  legend {
    width: 100%;
    padding: 2.5px 5px;
    border-bottom: solid var(--light-cyan-3);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  .range-input-container {
    width: 95%;
    max-width: 300px;
    margin: 0 auto;

    .range-input {
      width: 100%;
    }
  }
`;

export default CurrentLocationFilter;
