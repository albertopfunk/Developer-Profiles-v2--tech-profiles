import React from "react";
import axios from 'axios';

class CurrentLocationFilter extends React.Component {
  state = {
    milesWithinInput: "",
    locationInput: ""
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLocationChange = e => {


    this.setState({ [e.target.name]: e.target.value });


  };

  onChoosingLocation = () => {

  };

  render() {
    return (
      <section>
        <label htmlFor="milesWithin">
          Select Distance
          <input
            type="number"
            id="milesWithin"
            name="milesWithinInput"
            value={this.state.milesWithinInput}
            onChange={this.onInputChange}
          />
        </label>

        <label htmlFor="choosingLocation">
          Choose Location
          <input
            type="text"
            id="choosingLocation"
            autoComplete="off"
            name="locationInput"
            value={this.state.locationInput}
            onChange={this.onLocationChange}
          />
        </label>
        <button onClick={this.props.currentLocationFilter}>
          LOCATE WITHIN
        </button>
      </section>
    );
  }
}

export default CurrentLocationFilter;
