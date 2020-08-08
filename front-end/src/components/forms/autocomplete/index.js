import React from "react";

/*
  when user is typing and 'tabs' out from input, then the
  listbox should reset, value will be current value
  
  when the user is focusing on options, and clicks tab then
  listbox should reset, value will be the value that was focused on 

  listbox is hidden with display:none
  appears when user starts typing


*/

class AutoComplete extends React.Component {
  state = {
    timeOut: null,
    input: "",
    isUsingCombobox: false,
    currentFocusedOption: "",
    resultsInBank: true,
    autoCompleteResults: [],
    chosenNames: [],
  };

  optionRefs = [];

  componentDidMount() {
    if (this.props.chosenInputs) {
      this.setState({ chosenNames: this.props.chosenInputs });
    }
  }

  setOptionRefs = (element, index) => {
    if (element !== null) {
      this.optionRefs[index] = element;
    }
  };

  focusOnFirstOption = (e) => {
    if (this.state.autoCompleteResults.length > 0) {
      if (e.keyCode === 40) {
        e.preventDefault();
        if (this.optionRefs.length > 0) {
          this.setState({ currentFocusedOption: `result${0}` });
          this.optionRefs[0].focus();
        }
      }

      if (e.keyCode === 38) {
        e.preventDefault();
        if (this.optionRefs.length > 0) {
          this.setState({
            currentFocusedOption: `result${this.optionRefs.length - 1}`,
          });
          this.optionRefs[this.optionRefs.length - 1].focus();
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
          currentFocusedOption: `result${this.optionRefs.length - 1}`,
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

  onInputChange = async (value) => {
    /*
      first debounce with value runs, the promise is pending
      second debounce with no value runs, this.resetInput runs
      second input runs first, then when resolved, the first input
      runs second, rendering the predictions
      this is going to be a matter of needing to cancel a request
    */

    this.optionRefs = [];
    if (value.trim() === "") {
      this.resetInput();
      return;
    }

    let predictions = await this.props.onInputChange(value);

    if (predictions.length === 0) {
      this.setState({ resultsInBank: false, isUsingCombobox: true });

      this.resetInput(value);
      return;
    }

    this.setState({
      resultsInBank: true,
      isUsingCombobox: true,
      autoCompleteResults: predictions,
    });
  };

  debounceInput = (e) => {
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
      this.setState({ chosenNames: [{ name, id }] });
      this.resetInput(name);
      this.props.onChosenInput(name, id);
      return;
    }

    const newChosenNamesState = [...this.state.chosenNames];
    newChosenNamesState.push({ name, id });
    this.setState({ chosenNames: newChosenNamesState });
    this.resetInput();
    this.props.onChosenInput(newChosenNamesState);
  };

  resetInput = (name = "") => {
    this.setState({
      input: name,
      autoCompleteResults: [],
      isUsingCombobox: false,
      currentFocusedOption: "",
    });
  };

  removeChosenName = (location) => {
    let newChosenNamesState = this.state.chosenNames.filter((chosenName) => {
      return chosenName.name !== location.name;
    });

    this.setState({
      chosenNames: newChosenNamesState,
      autoCompleteResults: [],
      input: "",
    });

    this.props.removeChosenInput(newChosenNamesState);
  };

  render() {
    console.log("====AUTOCOMPLETE====", this.state);

    const { inputName } = this.props;
    const {
      input,
      resultsInBank,
      autoCompleteResults,
      isUsingCombobox,
      currentFocusedOption,
      chosenNames,
    } = this.state;

    return (
      <div>
        <label id={`${inputName}-label`} htmlFor={`${inputName}-search-input`}>
          <p style={{ textTransform: "capitalize" }}>
            {`Choose ${inputName.split("-")[1]}`}
          </p>
        </label>
        <div
          id={`${inputName}-search-combobox`}
          // combobox on parent is recommended by ARIA 1.1
          // eslint-disable-next-line
          role="combobox"
          aria-haspopup="listbox"
          aria-owns="results no-results"
          aria-expanded={isUsingCombobox}
        >
          <input
            type="search"
            autoComplete="off"
            id={`${inputName}-search-input`}
            name={`${inputName}-search-input`}
            aria-autocomplete="list"
            aria-controls="results no-results"
            aria-activedescendant={currentFocusedOption}
            value={input}
            onChange={(e) => this.debounceInput(e)}
            onKeyDown={(e) => this.focusOnFirstOption(e)}
          />
        </div>

        {/* {!this.state.resultsInBank && this.state.input ? (
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
        ) : null} */}

        {!resultsInBank && input ? (
          <ul
            id="no-results"
            role="listbox"
            aria-labelledby={`${inputName}-label`}
          >
            <li
              id="no-results-1"
              role="option"
              aria-selected="false"
              tabIndex="-1"
            >
              No Results
            </li>
          </ul>
        ) : null}

        <ul id="results" role="listbox" aria-labelledby={`${inputName}-label`}>
          {resultsInBank && autoCompleteResults.length > 0
            ? autoCompleteResults.map((prediction, i) => {
                return (
                  <li
                    id={`results-${i}`}
                    key={prediction.id}
                    role="option"
                    aria-selected={currentFocusedOption === `result${i}`}
                    tabIndex="-1"
                    ref={(ref) => {
                      this.setOptionRefs(ref, i);
                    }}
                    onKeyDown={(e) =>
                      this.chooseOnKeyDown(e, prediction.name, prediction.id, i)
                    }
                    onClick={() =>
                      this.choosePrediction(prediction.name, prediction.id)
                    }
                  >
                    {prediction.name}
                  </li>
                );
              })
            : null}
        </ul>

        {chosenNames.length === 0 ? null : (
          <ul>
            {chosenNames.map((chosenName) => {
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
