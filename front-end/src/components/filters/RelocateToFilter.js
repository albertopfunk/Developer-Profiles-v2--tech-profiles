import React from "react";
import axios from "axios";

class RelocateToFilter extends React.Component {
  state = {
    locationInput: "",
    locationAutocomplete: [],
    chosenLocationName: "",
    isUsingCombobox: false
  };

  onLocationChange = async e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (value.trim() === "") {
      this.setState({ isUsingCombobox: false });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/api/autocomplete`,
        { locationInput: value }
      );
      const predictions = response.data.predictions.map(location => {
        return {
          name: location.description,
          id: location.place_id
        };
      });
      this.setState({
        locationAutocomplete: predictions,
        isUsingCombobox: true
      });
    } catch (err) {
      console.log(err);
    }
  };

  chooseOnEnter = e => {
    if (e.keyCode === 13) {
      this.onChoosingLocation(e);
    }
  };

  onChoosingLocation = async e => {
    const { name } = e.target.dataset;
    this.props.relocateToFilter(name);
    this.setState({
      locationAutocomplete: [],
      locationInput: name,
      chosenLocationName: name,
      isUsingCombobox: false
    });
  };

  resetFilter = type => {
    this.setState({
      chosenLocationName: "",
      locationInput: "",
      locationAutocomplete: []
    });
    this.props.resetLocationFilters(type);
  };

  render() {
    return (
      <section>
        <div>
          <label htmlFor="search-location">
            Relocate To
            <input
              type="text"
              id="search-location"
              autoComplete="off"
              role="combobox"
              aria-expanded={this.state.isUsingCombobox}
              aria-haspopup="listbox"
              aria-controls="results"
              aria-owns="results"
              aria-autocomplete="list"
              name="locationInput"
              value={this.state.locationInput}
              onChange={this.onLocationChange}
            />
          </label>
        </div>
        <div>
          <ul id="results" role="listbox">
            {this.state.locationAutocomplete.length === 0
              ? null
              : this.state.locationAutocomplete.map(location => {
                  return (
                    <li
                      key={location.id}
                      role="option"
                      aria-selected="false"
                      tabIndex="0"
                      data-name={location.name}
                      data-id={location.id}
                      onKeyUp={this.chooseOnEnter}
                      onClick={this.onChoosingLocation}
                    >
                      {location.name}
                    </li>
                  );
                })}
          </ul>
        </div>
        {this.state.chosenLocationName === "" ? null : (
          <div>
            {this.state.chosenLocationName}{" "}
            <button
              type="reset"
              onClick={() => this.resetFilter("relocateToFilter")}
            >
              X
            </button>
          </div>
        )}
      </section>
    );
  }
}

export default RelocateToFilter;
