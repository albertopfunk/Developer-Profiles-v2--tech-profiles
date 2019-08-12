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

  chooseOnKeyUp = (e, locationName) => {
    if (e.keyCode === 13) {
      this.onChoosingLocation(locationName);
    }
    if (e.keyCode === 27) {
      this.resetFilter("relocateToFilter");
    }
  };

  onChoosingLocation = async name => {
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
                    // need to figure out accessability keyboard controls
                      // up and down arrows to move through list, esc to close list, enter to choose item and close list, tabindex to -1, 
                      // this will also allow you to add aria-activedescendant(changes as the user presses the Up and Down arrows, keyboard focus)
                      // aria-selected should be in sync with aria-activedescendant
                      // aria-live like https://alphagov.github.io/accessible-autocomplete/examples/
                      // aria-describedby https://haltersweb.github.io/Accessibility/autocomplete.html
                      // https://intopia.digital/articles/anatomy-accessible-auto-suggest/
                      // https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
                      // eslint-disable-next-line
                    <li
                      key={location.id}
                      role="option"
                      // should be true when item is on focus(not hover)
                      aria-selected="false"
                      tabIndex="0"
                      onKeyUp={(e) => this.chooseOnKeyUp(e, location.name)}
                      onClick={() => this.onChoosingLocation(location.name)}
                    >
                      {location.name}
                    </li>
                  );
                })}
          </ul>
        </div>
        {this.state.chosenLocationName === "" ? null : (
          // there should be something here for accessibility, to let know that this is related to the selection they made
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
