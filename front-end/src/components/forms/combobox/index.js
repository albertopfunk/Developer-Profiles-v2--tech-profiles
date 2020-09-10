import React from "react";
import styled from "styled-components";

class Combobox extends React.Component {
  state = {
    timeOut: null,
    input: "",
    inputSelectionRange: [],
    isUsingCombobox: false,
    currentFocusedOption: "",
    resultsInBank: true,
    autoCompleteResults: [],
    chosenOptions: [],
  };

  optionRefs = [];
  inputRef = React.createRef();

  componentDidMount() {
    if (this.props.chosenOptions) {
      this.setState({ chosenOptions: this.props.chosenOptions });
    }
  }

  setOptionRefs = (element, index) => {
    if (element !== null) {
      this.optionRefs[index] = element;
    }
  };

  inputFocusActions = (e) => {
    if (this.state.autoCompleteResults.length > 0) {
      // up arrow
      if (e.keyCode === 40) {
        e.preventDefault();
        if (this.optionRefs.length > 0) {
          this.setState({
            currentFocusedOption: `result${0}`,
            inputSelectionRange: [
              this.inputRef.current.selectionStart,
              this.inputRef.current.selectionEnd,
            ],
          });
          this.optionRefs[0].focus();
        }
      }

      // down arrow
      if (e.keyCode === 38) {
        e.preventDefault();
        if (this.optionRefs.length > 0) {
          this.setState({
            currentFocusedOption: `result${this.optionRefs.length - 1}`,
            inputSelectionRange: [
              this.inputRef.current.selectionStart,
              this.inputRef.current.selectionEnd,
            ],
          });
          this.optionRefs[this.optionRefs.length - 1].focus();
        }
      }
    }

    if (this.state.input.trim()) {
      // escape
      if (e.keyCode === 27) {
        this.closeCombobox();
      }
    }
  };

  optionFocusActions = (e, name, id, index) => {
    // home
    if (e.keyCode === 36) {
      e.preventDefault();
      this.focusOnInputWithSelectionRange("start");
    }
    // end
    if (e.keyCode === 35) {
      e.preventDefault();
      this.focusOnInputWithSelectionRange("end");
    }
    // left arrow
    if (e.keyCode === 37) {
      e.preventDefault();
      this.focusOnInputWithSelectionRange("left");
    }
    // right arrow
    if (e.keyCode === 39) {
      e.preventDefault();
      this.focusOnInputWithSelectionRange("right");
    }
    // up arrow
    if (e.keyCode === 38) {
      e.preventDefault();
      this.focusOnOption(index, "up");
    }
    // down arrow
    if (e.keyCode === 40) {
      e.preventDefault();
      this.focusOnOption(index, "down");
    }
    // enter
    if (e.keyCode === 13) {
      this.chooseOption(name, id);
      this.inputRef.current.focus();
    }
    // escape
    if (e.keyCode === 27) {
      this.closeCombobox();
      this.inputRef.current.focus();
    }
  };

  focusOnOption = (index, direction) => {
    if (direction === "up") {
      if (index === 0) {
        this.setState({
          currentFocusedOption: "",
        });
        this.focusOnInputWithSelectionRange("current");
      } else {
        this.setState({ currentFocusedOption: `result${index - 1}` });
        this.optionRefs[index - 1].focus();
      }
    }
    if (direction === "down") {
      if (index === this.optionRefs.length - 1) {
        this.setState({
          currentFocusedOption: "",
        });
        this.focusOnInputWithSelectionRange("current");
      } else {
        this.setState({ currentFocusedOption: `result${index + 1}` });
        this.optionRefs[index + 1].focus();
      }
    }
  };

  focusOnInputWithSelectionRange = (action) => {
    this.inputRef.current.focus();

    if (action === "start") {
      this.inputRef.current.setSelectionRange(0, 0);
    }

    if (action === "end") {
      this.inputRef.current.setSelectionRange(
        this.inputRef.current.value.length,
        this.inputRef.current.value.length
      );
    }

    if (action === "left") {
      if (this.state.inputSelectionRange[0] === this.state.inputSelectionRange[1]) {
        this.inputRef.current.setSelectionRange(
          this.state.inputSelectionRange[0] - 1,
          this.state.inputSelectionRange[1] - 1
        );
      } else {
        this.inputRef.current.setSelectionRange(
          this.state.inputSelectionRange[0],
          this.state.inputSelectionRange[0]
        );
      }
    }

    if (action === "right") {
      if (this.state.inputSelectionRange[0] === this.state.inputSelectionRange[1]) {
        this.inputRef.current.setSelectionRange(
          this.state.inputSelectionRange[0] + 1,
          this.state.inputSelectionRange[1] + 1
        );
      } else {
        this.inputRef.current.setSelectionRange(
          this.state.inputSelectionRange[1],
          this.state.inputSelectionRange[1]
        );
      }
    }

    if (action === "current") {
      this.inputRef.current.setSelectionRange(
        this.state.inputSelectionRange[0],
        this.state.inputSelectionRange[1]
      );
    }
  };

  onInputChange = async (value) => {
    /*
      first debounce with value runs, the promise is pending
      second debounce with no value runs, this.closeCombobox runs
      second input runs first, then when resolved, the first input
      runs second, rendering the results
      this is going to be a matter of needing to cancel a request
    */

    // need to reset option refs
    this.optionRefs = [];

    if (value.trim() === "") {
      // cancel request
      this.closeCombobox();
      return;
    }

    let results = await this.props.onInputChange(value);

    if (results.length === 0) {
      this.setState({
        input: value,
        autoCompleteResults: [],
        resultsInBank: false,
        isUsingCombobox: true,
        currentFocusedOption: "",
      });
      return;
    }

    this.setState({
      resultsInBank: true,
      isUsingCombobox: true,
      autoCompleteResults: results,
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

  chooseOption = (name, id) => {
    if (this.props.single) {
      this.setState({ chosenOptions: [{ name, id }] });
      this.closeCombobox(name);
      this.props.onChosenOption(name, id);
      return;
    }

    this.setState({
      chosenOptions: [...this.state.chosenOptions, { name, id }],
    });

    this.closeCombobox();
    this.props.onChosenOption([...this.state.chosenOptions, { name, id }]);
  };

  closeCombobox = (name = "") => {
    this.setState({
      input: name,
      autoCompleteResults: [],
      isUsingCombobox: false,
      currentFocusedOption: "",
      resultsInBank: true,
    });
  };

  removeChosenOption = (location) => {
    let filteredChosenOptions = this.state.chosenOptions.filter(
      (chosenOption) => {
        return chosenOption.name !== location.name;
      }
    );

    this.setState({
      chosenOptions: filteredChosenOptions,
      autoCompleteResults: [],
      input: "",
    });

    this.props.onRemoveChosenOption(filteredChosenOptions);
  };

  render() {
    console.log("---- Autocomplete ----", this.state);

    const { inputName, displayName } = this.props;
    const {
      input,
      resultsInBank,
      autoCompleteResults,
      isUsingCombobox,
      currentFocusedOption,
      chosenOptions,
    } = this.state;

    return (
      <div>
        <label id={`${inputName}-label`} htmlFor={`${inputName}-search-input`}>
          {displayName}
        </label>

        <InputContainer
          id={`${inputName}-search-combobox`}
          // combobox on parent is recommended by ARIA 1.1
          // eslint-disable-next-line
          role="combobox"
          aria-haspopup="listbox"
          aria-owns="results"
          aria-expanded={isUsingCombobox}
        >
          <input
            ref={this.inputRef}
            type="text"
            autoComplete="off"
            id={`${inputName}-search-input`}
            name={`${inputName}-search-input`}
            aria-describedby={`${inputName}-combobox-instructions`}
            aria-autocomplete="list"
            aria-controls="results"
            aria-activedescendant={currentFocusedOption}
            value={input}
            onChange={(e) => this.debounceInput(e)}
            onKeyDown={(e) => this.inputFocusActions(e)}
          />
          <span id={`${inputName}-combobox-instructions`} className="sr-only">
            {`chosen ${displayName} will be listed below`}
          </span>
        </InputContainer>

        <div
          aria-live="assertive"
          aria-atomic="true"
          aria-relevant="additions text"
        >
          {!resultsInBank && input ? (
            <>
              <span className="sr-only">showing zero results</span>

              <ul
                id="results"
                role="listbox"
                aria-labelledby={`${inputName}-label`}
              >
                <li
                  id="no-results"
                  role="option"
                  aria-selected="false"
                  tabIndex="-1"
                >
                  No Results
                </li>
              </ul>
            </>
          ) : null}

          {resultsInBank && autoCompleteResults.length > 0 ? (
            <>
              <span className="sr-only">
                {`showing ${autoCompleteResults.length} ${
                  autoCompleteResults.length === 1 ? "result" : "results"
                }`}
              </span>

              <ul
                id="results"
                role="listbox"
                aria-labelledby={`${inputName}-label`}
              >
                {autoCompleteResults.map((option, i) => {
                  return (
                    <li
                      id={`results-${i}`}
                      key={option.id}
                      role="option"
                      aria-selected={currentFocusedOption === `result${i}`}
                      tabIndex="-1"
                      ref={(ref) => {
                        this.setOptionRefs(ref, i);
                      }}
                      onKeyDown={(e) =>
                        this.optionFocusActions(e, option.name, option.id, i)
                      }
                      onClick={() => this.chooseOption(option.name, option.id)}
                    >
                      {option.name}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>

        {chosenOptions.length > 0 ? (
          <ChosenNamesGroup aria-label={`chosen ${displayName}`}>
            {chosenOptions.map((chosenOption) => {
              return (
                <li key={chosenOption.id}>
                  <span>{chosenOption.name}</span>
                  <button
                    type="button"
                    aria-label={`remove ${chosenOption.name}`}
                    onClick={() => this.removeChosenOption(chosenOption)}
                  >
                    <span>X</span>
                  </button>
                </li>
              );
            })}
          </ChosenNamesGroup>
        ) : null}
      </div>
    );
  }
}

const InputContainer = styled.div`
  .sr-only {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
  }
`;

const ChosenNamesGroup = styled.ul`
  .sr-only {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
  }
`;

export default Combobox;
