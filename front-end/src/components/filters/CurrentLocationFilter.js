import React from "react";
import axios from "axios";

class CurrentLocationFilter extends React.Component {
  state = {
    milesWithinInput: 10,
    locationInput: "",
    locationAutocomplete: [],
    chosenLocationName: "",
    chosenLocationId: "",
    isUsingCombobox: false
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDistanceChange = () => {
    if (this.state.chosenLocationName !== "") {
      this.onChoosingLocation(
        this.state.chosenLocationName,
        this.state.chosenLocationId
      );
    } else {
      return;
    }
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

  chooseOnKeyUp = (e, locationName, locationId) => {
    if (e.keyCode === 13) {
      this.onChoosingLocation(locationName, locationId);
    }
    if (e.keyCode === 27) {
      this.resetFilter("currLocationFilter");
    }
  };

  onChoosingLocation = async (name, id) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/gio`, {
        placeId: id
      });
      const updateState = {
        selectedWithinMiles: this.state.milesWithinInput,
        chosenLocationLat: response.data.lat,
        chosenLocationLon: response.data.lng
      };
      this.props.currentLocationFilter(updateState);
      this.setState({
        locationAutocomplete: [],
        locationInput: name,
        chosenLocationName: name,
        chosenLocationId: id,
        isUsingCombobox: false
      });
    } catch (err) {
      console.log(err);
    }
  };

  resetFilter = type => {
    this.setState({
      milesWithinInput: 10,
      chosenLocationName: "",
      locationInput: "",
      locationAutocomplete: []
    });
    this.props.resetLocationFilters(type);
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
            />
            {this.state.milesWithinInput}
          </label>
        </div>

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
                      // to use arrow keys, you can combine the keyboard arrow key code(up=38,down=40), with the <lis> which will have refs
                      // if a user chooses up, then choose the correct ref, and add a focus() state to it
                      // you can reference the <li> refs by the id, or index
                      // https://stackoverflow.com/questions/44357255/change-focus-of-text-input-with-react
                      // https://codepulse.blog/how-to-focus-element-in-react/
                      // eslint-disable-next-line
                      <li
                        key={location.id}
                        role="option"
                        // should be true when item is on focus(not hover)
                        aria-selected="false"
                        tabIndex="0"
                        onKeyUp={(e) => this.chooseOnKeyUp(e, location.name, location.id)}
                        onClick={() =>
                          this.onChoosingLocation(location.name, location.id)
                        }
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
                onClick={() => this.resetFilter("currLocationFilter")}
              >
                X
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default CurrentLocationFilter;
