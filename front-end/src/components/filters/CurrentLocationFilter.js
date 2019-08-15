import React from "react";
import axios from "axios";

import LocationAutoComplete from "./LocationAutoComplete";

class CurrentLocationFilter extends React.Component {
  state = {
    milesWithinInput: 10,
    chosenLocationName: "",
    chosenLocationId: ""
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDistanceChange = () => {
    if (this.state.chosenLocationName !== "") {
      this.onChosenLocation(
        this.state.chosenLocationName,
        this.state.chosenLocationId,
        true
      );
    } else {
      return;
    }
  };

  onChosenLocation = async (name, id, distChange) => {
    if (!distChange) {
      this.setState({ chosenLocationName: name, chosenLocationId: id });
    }

    try {
      const response = await axios.post(`http://localhost:3001/api/gio`, {
        placeId: id
      });
      await this.props.setStateAsync({
        usersPage: 1,
        selectedWithinMiles: this.state.milesWithinInput,
        chosenLocationLat: response.data.lat,
        chosenLocationLon: response.data.lng,
        isUsingSortByChoice: true,
        isUsingCurrLocationFilter: true
      });
      this.props.loadUsers();
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  resetLocationFilter = async () => {
    await this.props.setStateAsync({
      isUsingCurrLocationFilter: false
    });
    this.props.loadUsers();
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
              min="10"
              max="5000"
              id="choose-miles"
              name="milesWithinInput"
              value={this.state.milesWithinInput}
              onChange={this.onInputChange}
              onMouseUp={this.onDistanceChange}
              onBlur={this.onDistanceChange}
            />
            {this.state.milesWithinInput}
          </label>
        </div>
        <LocationAutoComplete
          onChosenLocation={this.onChosenLocation}
          resetLocationFilter={this.resetLocationFilter}
        />
      </section>
    );
  }
}

export default CurrentLocationFilter;
