import React from "react";
import axios from "axios";

class LocationAutoComplete extends React.Component {
  state = {
    input: "",
    autoComplete: [],
    chosenNames: [],
    isUsingCombobox: false,
    currentFocusedOption: ""
  };

  optionRefs = [];

  // Tests
  // adds ref element into the array, index starts at 0 from map()
  setOptionRefs = (element, index) => {
    this.optionRefs[index] = element;
  };

  // Tests
  // focusOnFirstOption with down arrow key focuses on first <li>
  // only runs when there are <li>s present
  // focusOnFirstOption with esc key resets filter with resetFilter()
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

  // Tests
  // chooseOnKeyDown with up or down arrow keys moves focus of <li>s respectively with focusOnOption()
  // chooseOnKeyDown with enter key chooses location with chooseLocation()
  // chooseOnKeyDown with esc key resets filter with resetFilter()
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

  // Tests
  // focuses on next or previous <li>
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

  // Tests
  // closes combobox and removes <li> when no characters are found on input change, i.e blank/spaces
  // calls Autocomplete API on input change, sends current input
  // Autocomplete API returns an array of predictions based on input, or an empty array based on input if no locations found
  // they are immediately mapped to extract the name and ID of each prediction
  // autoComplete: predictions, adds each prediction to autoComplete state which is used by <li>s
  // isUsingCombobox: true opens combobox, even is array is empty(
  // use this for aria-describeby, i.e 'there are x location predictions available for you')
  onLocationChange = async e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (value.trim() === "") {
      this.setState({ isUsingCombobox: false, autoComplete: [] });
      return;
    }
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
      this.setState({
        autoComplete: predictions,
        isUsingCombobox: true
      });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  // Tests
  // autoComplete: [], should remove all <li> from UI
  // isUsingCombobox: false, closes combobox for accessibility
  // input: name, should change <input> value to chosen name
  // chosenName: name, should make chosenName UI appear, with the correct chosen location and reset btn
  // calls onChosenLocation to change user based on this filter being on and chosen location(name, id)
  chooseLocation = (name, id) => {

    // need to account for 1 location(current) and
    // +1 locations(skills/relocateTo)
    // on back end, relocateTo will filter with array
    // current location will stay the same
    // you can send array to both, and set state differently here
    // 1s will empty the array

    console.log(this.props.singular)

    
    
    let newChosenNamesState = [...this.state.chosenNames];
    
    if (newChosenNamesState.includes(name)) {
      this.setState({
        autoComplete: [],
        input: "",
        isUsingCombobox: false
      });
      return;
    }
    
    // for current locations
    if (this.props.singular) {
      this.setState({
        autoComplete: [],
        input: name,
        chosenNames: [name],
        isUsingCombobox: false
      });
      this.props.onChosenLocation(name, id);
      return;
    }


    // for skills and relocate to
    newChosenNamesState.push(name);
    this.setState({
      autoComplete: [],
      input: "",
      chosenNames: newChosenNamesState,
      isUsingCombobox: false
    });
    this.props.onChosenLocation(newChosenNamesState);
  };

  // Tests
  // autoComplete: [], should remove all <li> from UI
  // isUsingCombobox: false, closes combobox for accessibility
  // input: "", should remove value from <input>
  // chosenName: "", should make chosenName UI dissapear
  // calls resetLocationFilter to change users based on this filter being off
  resetFilter = (location) => {
    if (this.props.singular) {
      this.setState({
        chosenNames: [],
        input: ""
      });
      this.props.resetLocationFilter();
      return;
    }

    let chosenNamesState = [...this.state.chosenNames]
    let newChosenNamesState = chosenNamesState.filter(chosenName => {
      return chosenName !== location;
    })

    if (newChosenNamesState.length > 0) {
      this.setState({
        chosenNames: newChosenNamesState
      });
      this.props.resetLocationFilter(newChosenNamesState);
      return;
    }

    this.setState({
      chosenNames: []
    });
    this.props.resetLocationFilter();
  };

  render() {
    return (
      <div className="location">
        <div>
          <label htmlFor="search-location">
            Choose Location
            {/* aria-expanded should be true when any value exists on input(no blank spaces) */}
            {/* aria-activedescendant shows correct focused <li> based on id */}
            {/* onChange sets new predictions based on AutoComplete API, changes <li> */}
            {/* onKeyDown only runs when there are <li>s present */}
            {/* onKeyDown with down arrow key focuses on first option(<li>) */}
            {/* onKeyDown with esc key resets filter with resetFilter() */}
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
                    // setOptionRefs each li is a custom ref based on index
                    // chooseOnKeyDown with up or down arrow keys moves focus of <li>s respectively
                    // chooseOnKeyDown with enter key chooses location with chooseLocation()
                    // chooseOnKeyDown with esc key resets filter with resetFilter()
                    // chooseLocation chooses location on mouse click
                    // shows correct name of location prediction
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

        {/* Test */}
        {/* Should only appear when a user chooses a location */}
        {/* should display correct chosen location */}
        {/* should display btn to reset location combobox */}
        {/* resetting combobox makes chosenName an empty str again so this UI should dissapear onClick of reset btn */}
        {this.state.chosenNames.length === 0 ? null : (
          <aside id="results">
            {this.state.chosenNames.map(chosenName => {
              return (
                <div key={chosenName}>
                  <span>{chosenName}</span>
                  <button type="reset" onClick={() => this.resetFilter(chosenName)}>
                    X
                  </button>
                </div>
              )
            })}
          </aside>
        )}
      </div>
    );
  }
}

export default LocationAutoComplete;
