import React from "react";

class AutoComplete extends React.Component {
  state = {
    input: "",
    timeOut: null,
    resultsInBank: true,
    autoCompleteResults: [],
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

  // autoCompleteResults: predictions, adds each prediction to autoComplete state which is used by <li>s
  // isUsingCombobox: true opens combobox, even is array is empty(
  // use this for aria-describeby, i.e 'there are x location predictions available for you')
  onInputChange = async value => {
    if (value.trim() === "") {
      this.setState({ isUsingCombobox: false, autoCompleteResults: [] });
      return;
    }

    const results = await this.props.inputChangeFunc(value);

    if (results.length > 0) {
      this.setState({
        resultsInBank: true,
        isUsingCombobox: true,
        autoCompleteResults: results
      });
    } else {
      this.setState({
        resultsInBank: false,
        isUsingCombobox: false,
        autoCompleteResults: []
      });
    }
  };

  debounceInput = e => {
    let currTimeOut;

    const { name, value } = e.target;
    this.setState({ [name]: value });

    if (this.state.timeOut) {
      clearTimeout(this.state.timeOut);
    }

    currTimeOut = setTimeout(() => {
      this.setState({ timeOut: null });
      this.onInputChange(value);
    }, 250);

    this.setState({ timeOut: currTimeOut });
  };

  // Tests
  // autoCompleteResults: [], should remove all <li> from UI
  // isUsingCombobox: false, closes combobox for accessibility
  // input: name, should change <input> value to chosen name
  // chosenName: name, should make chosenName UI appear, with the correct chosen location and reset btn
  // calls onChosenInput to change user based on this filter being on and chosen location(name, id)
  choosePrediction = (name, id) => {
    const newChosenNamesState = [...this.state.chosenNames];

    if (newChosenNamesState.includes(name)) {
      this.setState({
        autoCompleteResults: [],
        input: "",
        isUsingCombobox: false
      });
      return;
    }

    if (this.props.single) {
      this.setState({
        autoCompleteResults: [],
        input: name,
        chosenNames: [name],
        isUsingCombobox: false
      });
      this.props.onChosenInput(name, id);
      return;
    }

    newChosenNamesState.push(name);
    this.setState({
      autoCompleteResults: [],
      input: "",
      chosenNames: newChosenNamesState,
      isUsingCombobox: false
    });
    this.props.onChosenInput(newChosenNamesState);
  };

  // Tests
  // autoCompleteResults: [], should remove all <li> from UI
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
          autoCompleteResults: [],
          input: ""
        });
        this.props.resetInputFilter(newChosenNamesState);
        return;
      }
    }

    this.setState({
      chosenNames: [],
      autoCompleteResults: [],
      input: ""
    });
    this.props.resetInputFilter();
  };

  resetOnSubmit = () => {
    this.setState({ chosenNames: [], autoCompleteResults: [], input: "" });
  };

  render() {
    console.log("====AUTOCOMPLETE====", this.state.isUsingCombobox);
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
              onChange={e => this.debounceInput(e)}
              onKeyDown={e =>
                this.state.autoCompleteResults.length > 0
                  ? this.focusOnFirstOption(e)
                  : null
              }
            />
          </label>
        </div>

        <div>
          {/* need to do something similar to locations when there is none */}
          {this.props.skills &&
          !this.state.resultsInBank &&
          this.state.input ? (
            <div>
              <p>
                {this.state.input} is not in our system, click on the button to
                add it
              </p>
              <p>skill will be reviewed for apporval</p>
              <button
                onClick={() => {
                  this.props.addNewSkill(this.state.input);
                  this.setState({ input: "" });
                }}
              >
                Add Skill
              </button>
            </div>
          ) : null}

          <ul id="results" role="listbox">
            {this.state.autoCompleteResults.length === 0
              ? null
              : this.state.autoCompleteResults.map((prediction, i) => {
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
          <ul id="results">
            {this.state.chosenNames.map(chosenName => {
              return (
                <li key={chosenName}>
                  <p style={{ display: "inline" }}>{chosenName}</p>
                  <button
                    type="button"
                    onClick={() => this.resetFilter(chosenName)}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default AutoComplete;
