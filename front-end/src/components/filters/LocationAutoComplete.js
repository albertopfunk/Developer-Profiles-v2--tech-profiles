import React from "react";
import axios from "axios";

class LocationAutoComplete extends React.Component {
  state = {
    input: "",
    autoComplete: [],
    chosenName: "",
    chosenId: "",
    isUsingCombobox: false,
    currentFocusedOption: ""
  };

  optionRefs = [];

  setOptionRefs = (element, index) => {
    this.optionRefs[index] = element;
  };

  focusOnFirstOption = e => {
    if (e.keyCode === 40) {
      e.preventDefault();
      if (this.optionRefs.length > 0) {
        this.setState({ currentFocusedOption: `result${0}` });
        this.optionRefs[0].focus();
      } else {
        return;
      }
    }
    if (e.keyCode === 27) {
      this.resetFilter();
    }
  };

  chooseOnKeyDown = (e, locationName, locationId, index) => {
    if (e.keyCode === 38) {
      e.preventDefault();
      this.focusOnOption(index, "up");
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      this.focusOnOption(index, "down");
    }
    if (e.keyCode === 13) {
      this.chooseLocation(locationName, locationId);
    }
    if (e.keyCode === 27) {
      this.resetFilter();
    }
  };

  focusOnOption = (index, direction) => {
    if (direction === "up") {
      if (index === 0) {
        this.setState({
          currentFocusedOption: `result${this.optionRefs.length - 1}`
        });
        this.optionRefs[this.optionRefs.length - 1].focus();
      } else {
        this.setState({ currentFocusedOption: `result${index - 1}` });
        this.optionRefs[index - 1].focus();
      }
    }
    if (direction === "down") {
      if (index === this.optionRefs.length - 1) {
        this.setState({ currentFocusedOption: `result${0}` });
        this.optionRefs[0].focus();
      } else {
        this.setState({ currentFocusedOption: `result${index + 1}` });
        this.optionRefs[index + 1].focus();
      }
    }
  };

  onLocationChange = async e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (value.trim() === "") {
      this.setState({ isUsingCombobox: false, autoComplete: [] });
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
        autoComplete: predictions,
        isUsingCombobox: true
      });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  chooseLocation = (name, id) => {
    this.setState({
      autoComplete: [],
      input: name,
      chosenName: name,
      chosenId: id,
      isUsingCombobox: false
    });
    this.props.onChosenLocation(name, id);
  };

  resetFilter = () => {
    this.setState({
      autoComplete: [],
      input: "",
      chosenName: "",
      chosenId: "",
      isUsingCombobox: false
    });
    this.props.resetLocationFilter();
  };

  render() {
    return (
      <div className="location">
        <div>
          <label htmlFor="search-location">
            Choose Location
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
              aria-activedescendant={this.state.currentFocusedOption}
              name="input"
              value={this.state.input}
              onChange={this.onLocationChange}
              onKeyDown={e =>
                this.state.autoComplete.length > 0
                  ? this.focusOnFirstOption(e)
                  : null
              }
            />
          </label>
        </div>
        <div>
          <ul id="results" role="listbox">
            {this.state.autoComplete.length === 0
              ? null
              : this.state.autoComplete.map((location, i) => {
                  return (
                    <li
                      id={`result${i}`}
                      key={location.id}
                      role="option"
                      aria-selected={
                        this.state.currentFocusedOption === `result${i}`
                      }
                      tabIndex="-1"
                      ref={ref => {
                        this.setOptionRefs(ref, i);
                      }}
                      onKeyDown={e =>
                        this.chooseOnKeyDown(e, location.name, location.id, i)
                      }
                      onClick={() =>
                        this.chooseLocation(location.name, location.id)
                      }
                    >
                      {location.name}
                    </li>
                  );
                })}
          </ul>
        </div>
        {this.state.chosenName === "" ? null : (
          <aside id="results">
            {this.state.chosenName}{" "}
            <button type="reset" onClick={() => this.resetFilter()}>
              X
            </button>
          </aside>
        )}
      </div>
    );
  }
}

export default LocationAutoComplete;
