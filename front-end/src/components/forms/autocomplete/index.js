import React from "react";

class AutoComplete extends React.Component {
  state = {
    timeOut: null,
    input: "",
    isUsingCombobox: false,
    currentFocusedOption: "",
    resultsInBank: true,
    autoCompleteResults: [],
    chosenNames: [],
    chosenNameDup: false
  };

  optionRefs = [];

  componentDidMount() {
    if (this.props.chosenInputs) {
      this.setState({ chosenNames: this.props.chosenInputs });
    }
  }

  componentDidUpdate(prevProps) {
    console.log("UPDATED");
  }

  setOptionRefs = (element, index) => {
    if (element !== null) {
      this.optionRefs[index] = element;
    }
  };

  focusOnFirstOption = e => {
    if (this.state.autoCompleteResults.length > 0) {
      if (e.keyCode === 40) {
        e.preventDefault();
        if (this.optionRefs.length > 0) {
          this.setState({ currentFocusedOption: `result${0}` });
          this.optionRefs[0].focus();
        } else {
          return;
        }
      }
    }
    if (this.state.input.trim()) {
      if (e.keyCode === 27) {
        this.resetInput();
      }
    }
  };

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
      this.resetInput();
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

  onInputChange = async value => {
    this.optionRefs = [];
    if (value.trim() === "") {
      this.setState({ isUsingCombobox: false, autoCompleteResults: [] });
      return;
    }

    let predictions = await this.props.onInputChange(value);

    if (!predictions) {
      this.setState({
        resultsInBank: false,
        isUsingCombobox: false,
        autoCompleteResults: []
      });
      return;
    }

    if (predictions.length === 0) {
      this.setState({
        resultsInBank: false,
        isUsingCombobox: false,
        autoCompleteResults: []
      });
      return;
    }

    this.setState({
      resultsInBank: true,
      isUsingCombobox: true,
      autoCompleteResults: predictions
    });
  };

  debounceInput = e => {
    let currTimeOut;

    const { value } = e.target;
    this.setState({ input: value });

    if (this.state.timeOut) {
      clearTimeout(this.state.timeOut);
    }

    currTimeOut = setTimeout(() => {
      this.setState({ timeOut: null });
      this.onInputChange(value);
    }, 200);

    this.setState({ timeOut: currTimeOut });
  };

  choosePrediction = (name, id) => {
    if (this.props.single) {
      this.setState({
        autoCompleteResults: [],
        input: name,
        chosenNames: [{ name, id }],
        isUsingCombobox: false
      });
      this.props.onChosenInput(name, id);
      return;
    }

    const newChosenNamesState = [...this.state.chosenNames];
    newChosenNamesState.push({ name, id });
    this.setState({
      autoCompleteResults: [],
      input: "",
      chosenNames: newChosenNamesState,
      isUsingCombobox: false
    });
    this.props.onChosenInput(newChosenNamesState);
  };

  resetInput = () => {
    this.setState({
      isUsingCombobox: false,
      input: "",
      autoCompleteResults: []
    });
  };

  removeChosenName = location => {
    let newChosenNamesState = this.state.chosenNames.filter(chosenName => {
      return chosenName.name !== location.name;
    });

    this.setState({
      chosenNames: newChosenNamesState,
      autoCompleteResults: [],
      input: ""
    });

    this.props.removeChosenInput(newChosenNamesState);
  };

  resetOnSubmit = () => {
    this.setState({ chosenNames: [], autoCompleteResults: [], input: "" });
  };

  render() {
    console.log("====AUTOCOMPLETE====", this.state);
    return (
      <div>
        <div>
          {/* aria-expanded should be true when any value exists on input(no blank spaces) */}
          {/* aria-activedescendant shows correct focused <li> based on id */}
          {/* onChange sets new predictions based on AutoComplete API, changes <li> */}
          {/* onKeyDown only runs when there are <li>s present */}
          {/* onKeyDown with down arrow key focuses on first option(<li>) */}
          {/* onKeyDown with esc key resets filter with resetInput() */}
          <label htmlFor={`${this.props.inputName}-search-predictions`}>
            <p style={{ textTransform: "capitalize" }}>
              {`Choose ${this.props.inputName.split("-")[1]}`}
            </p>
          </label>
          <input
            type="text"
            id={`${this.props.inputName}-search-predictions`}
            autoComplete="off"
            role="combobox"
            aria-expanded={this.state.isUsingCombobox}
            aria-haspopup="listbox"
            aria-controls="results"
            aria-owns="results"
            aria-autocomplete="list"
            aria-activedescendant={this.state.currentFocusedOption}
            name={`${this.props.inputName}-search-predictions`}
            value={this.state.input}
            onChange={e => this.debounceInput(e)}
            onKeyDown={e => this.focusOnFirstOption(e)}
          />
        </div>

        {!this.state.resultsInBank && this.state.input ? (
          <div>
            <p>No Results</p>

            {this.props.inputName.includes("location") ? (
              <p>Please choose a valid city</p>
            ) : null}

            {this.props.inputName.includes("skill") ? (
              <>
                <p>
                  {this.state.input} is not in our system, click on the button
                  to add it
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
              </>
            ) : null}
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
                  // chooseOnKeyDown with esc key resets filter with resetInput()
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
                      this.chooseOnKeyDown(e, prediction.name, prediction.id, i)
                    }
                    onClick={() =>
                      this.choosePrediction(prediction.name, prediction.id)
                    }
                  >
                    {prediction.name}
                  </li>
                );
              })}
        </ul>

        {/* Test */}
        {/* Should only appear when a user chooses a location */}
        {/* should display correct chosen location */}
        {/* should display btn to reset location combobox */}
        {/* resetting combobox makes chosenName an empty str again so this UI should dissapear onClick of reset btn */}
        {this.state.chosenNames.length === 0 ? null : (
          <ul id="results">
            {this.state.chosenNames.map(chosenName => {
              return (
                <li key={chosenName.id}>
                  <p style={{ display: "inline" }}>{chosenName.name}</p>
                  <button
                    type="button"
                    onClick={() => this.removeChosenName(chosenName)}
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
