import React from "react";
import axios from "axios";

class AutoComplete extends React.Component {
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
  // down arrow key focuses on first <li>
  // only runs when there are <li>s present
  // esc key resets filter with resetFilter()
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
  // chooseOnKeyDown with enter key chooses prediction with choosePrediction()
  // chooseOnKeyDown with esc key resets filter with resetFilter()
  chooseOnKeyDown = (e, name, id, index) => {
    if (e.keyCode === 38) {
      e.preventDefault();
      this.focusOnOption(index, "up");
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      this.focusOnOption(index, "down");
    }
    if (e.keyCode === 13) {
      this.choosePrediction(name, id);
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

  // if props.skills
  // calls skills autocomplete API on input change, sends current input
  // skills autocomplete API returns an array of predictions based on input, or an empty array based on input if no locations found
  // returns {id, skill}
  // skills predictions are don't need to be mapped and already contain skill and ID of each prediction

  // if not this.props.skills
  // calls Autocomplete API on input change, sends current input
  // Autocomplete API returns an array of predictions based on input, or an empty array based on input if no locations found
  // returns {id, name}
  // location predictions are mapped to extract the name and ID of each prediction

  // autoComplete: predictions, adds each prediction to autoComplete state which is used by <li>s
  // isUsingCombobox: true opens combobox, even is array is empty(
  // use this for aria-describeby, i.e 'there are x location predictions available for you')
  onInputChange = async e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (value.trim() === "") {
      this.setState({ isUsingCombobox: false, autoComplete: [] });
      return;
    }

    if (this.props.skills) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER}/skills/autocomplete`,
          { skillsInput: value }
        );
        this.setState({
          autoComplete: response.data,
          isUsingCombobox: true
        });
      } catch (err) {
        console.error(`${err.response.data.message} =>`, err);
      }
      return;
    }

    if (this.props.locations) {
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
      return;
    }
  };

  // Tests
  // autoComplete: [], should remove all <li> from UI
  // isUsingCombobox: false, closes combobox for accessibility
  // input: name, should change <input> value to chosen name
  // chosenName: name, should make chosenName UI appear, with the correct chosen location and reset btn
  // calls onChosenInput to change user based on this filter being on and chosen location(name, id)
  choosePrediction = (name, id) => {
    const newChosenNamesState = [...this.state.chosenNames];

    if (newChosenNamesState.includes(name)) {
      this.setState({
        autoComplete: [],
        input: "",
        isUsingCombobox: false
      });
      return;
    }

    if (this.props.singular) {
      this.setState({
        autoComplete: [],
        input: name,
        chosenNames: [name],
        isUsingCombobox: false
      });
      this.props.onChosenInput(name, id);
      return;
    }

    newChosenNamesState.push(name);
    this.setState({
      autoComplete: [],
      input: "",
      chosenNames: newChosenNamesState,
      isUsingCombobox: false
    });
    this.props.onChosenInput(newChosenNamesState);
  };

  // Tests
  // autoComplete: [], should remove all <li> from UI
  // isUsingCombobox: false, closes combobox for accessibility
  // input: "", should remove value from <input>
  // chosenName: "", should make chosenName UI dissapear
  // calls resetInputFilter to change users based on this filter being off
  resetFilter = location => {
    if (this.props.multiple) {
      let chosenNamesState = [...this.state.chosenNames];
      let newChosenNamesState = chosenNamesState.filter(chosenName => {
        return chosenName !== location;
      });

      if (newChosenNamesState.length > 0) {
        this.setState({
          chosenNames: newChosenNamesState,
          autoComplete: [],
          input: ""
        });
        this.props.resetInputFilter(newChosenNamesState);
        return;
      }
    }

    this.setState({
      chosenNames: [],
      autoComplete: [],
      input: ""
    });
    this.props.resetInputFilter();
  };

  render() {
    return (
      <div>
        <div>
          <label htmlFor="search-predictions">
            {this.props.skills ? "Choose Skills" : "Choose Location"}
            {/* aria-expanded should be true when any value exists on input(no blank spaces) */}
            {/* aria-activedescendant shows correct focused <li> based on id */}
            {/* onChange sets new predictions based on AutoComplete API, changes <li> */}
            {/* onKeyDown only runs when there are <li>s present */}
            {/* onKeyDown with down arrow key focuses on first option(<li>) */}
            {/* onKeyDown with esc key resets filter with resetFilter() */}
            <input
              type="text"
              id="search-predictions"
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
              onChange={this.onInputChange}
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
              : this.state.autoComplete.map((prediction, i) => {
                  return (
                    // setOptionRefs each li is a custom ref based on index
                    // chooseOnKeyDown with up or down arrow keys moves focus of <li>s respectively
                    // chooseOnKeyDown with enter key chooses prediction with choosePrediction()
                    // chooseOnKeyDown with esc key resets filter with resetFilter()
                    // choosePrediction chooses prediction on mouse click
                    // shows correct name of prediction
                    <li
                      id={`result${i}`}
                      key={prediction.id}
                      role="option"
                      aria-selected={
                        this.state.currentFocusedOption === `result${i}`
                      }
                      tabIndex="-1"
                      ref={ref => {
                        this.setOptionRefs(ref, i);
                      }}
                      onKeyDown={e =>
                        this.chooseOnKeyDown(
                          e,
                          prediction.name || prediction.skill,
                          prediction.id,
                          i
                        )
                      }
                      onClick={() =>
                        this.choosePrediction(
                          prediction.name || prediction.skill,
                          prediction.id
                        )
                      }
                    >
                      {prediction.name || prediction.skill}
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
                  <button
                    type="reset"
                    onClick={() => this.resetFilter(chosenName)}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </aside>
        )}
      </div>
    );
  }
}

export default AutoComplete;
