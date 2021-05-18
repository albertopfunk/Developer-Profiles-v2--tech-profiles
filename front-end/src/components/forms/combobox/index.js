import React from "react";
import styled from "styled-components";
import {
  CANCEL_STATUS,
  COMBOBOX_STATUS,
} from "../../../global/helpers/variables";

class Combobox extends React.Component {
  state = {
    input: "",
    inputTimeout: null,

    comboboxStatus: COMBOBOX_STATUS.idle,
    comboboxLoading: COMBOBOX_STATUS.idle,
    errorMessage: "",

    inputResults: [],
    shouldAnnounceResults: false,

    selectedOption: {},
    selectedOptionIndex: null,
    selectedOptionId: "",

    chosenOptions: [],
    removedChosenOptionIndex: null,
  };

  chosenOptionBtnRefs = [];
  inputRef = React.createRef();
  asyncCancelRef = React.createRef();

  componentDidMount() {
    if (this.props.chosenOptions?.length > 0) {
      this.setState({ chosenOptions: this.props.chosenOptions });
    }
  }

  componentDidUpdate(prevProps) {
    // keyboard list focus management when removing chosen options
    if (this.props.chosenOptions.length < prevProps.chosenOptions.length) {
      if (this.chosenOptionBtnRefs.length === 0) {
        this.inputRef.current.focus();
        return;
      }

      if (this.chosenOptionBtnRefs.length === 1) {
        this.chosenOptionBtnRefs[0].focus();
        return;
      }

      const index = this.state.removedChosenOptionIndex;
      if (this.chosenOptionBtnRefs[index]) {
        this.chosenOptionBtnRefs[index].focus();
      } else {
        this.chosenOptionBtnRefs[index - 1].focus();
      }
    }
  }

  setChosenOptionBtnRefs = (element, index) => {
    if (element !== null) {
      this.chosenOptionBtnRefs[index] = element;
    }
  };

  onInputChange = async (value) => {
    if (value.trim() === "") {
      this.asyncCancelRef.current = CANCEL_STATUS.cancel;
      this.closeCombobox();
      return;
    }

    let loadingTimeout = setTimeout(() => {
      this.setState({
        comboboxLoading: COMBOBOX_STATUS.loading,
      });
    }, 250);

    let results = await this.props.onInputChange(value);

    clearTimeout(loadingTimeout);

    if (this.asyncCancelRef.current === CANCEL_STATUS.cancel) {
      return;
    }

    if (results?.error) {
      this.closeCombobox(value, COMBOBOX_STATUS.error);
      this.setState({
        errorMessage: results.error,
      });
      return;
    }

    // keeps combobox open to show 'no results' ui
    if (results.length === 0) {
      this.setState({
        inputResults: [],
        comboboxStatus: COMBOBOX_STATUS.noResults,
        comboboxLoading: COMBOBOX_STATUS.idle,
        selectedOption: {},
        selectedOptionIndex: null,
        selectedOptionId: "",
        shouldAnnounceResults: true,
      });
      return;
    }

    this.setState({
      inputResults: results,
      comboboxStatus: COMBOBOX_STATUS.active,
      comboboxLoading: COMBOBOX_STATUS.idle,
      selectedOption: {},
      selectedOptionIndex: null,
      selectedOptionId: "",
      shouldAnnounceResults: true,
    });
  };

  debounceInput = (e) => {
    const { value } = e.target;
    let currTimeOut;

    this.asyncCancelRef.current = CANCEL_STATUS.ok;
    this.setState({
      input: value,
      shouldAnnounceResults: false,
    });

    if (this.state.inputTimeout) {
      clearTimeout(this.state.inputTimeout);
    }

    currTimeOut = setTimeout(() => {
      this.setState({ inputTimeout: null });
      this.onInputChange(value);
    }, 200);

    this.setState({ inputTimeout: currTimeOut });
  };

  getCurrentResults = (e) => {
    const { value } = e.target;

    if (!value) return;

    // shouldn't fetch if single has chosen option
    if (this.props.single && value === this.state.chosenOptions[0]?.name) {
      return;
    }
    this.onInputChange(value);
  };

  chooseSelectedOption(e) {
    if (this.state.comboboxStatus === COMBOBOX_STATUS.idle) return;

    if (!this.state.selectedOptionId) {
      this.closeCombobox(e.target.value);
      return;
    }

    const { name, id } = this.state.selectedOption;
    this.chooseOption(name, id);
  }

  inputFocusActions = (e) => {
    const {
      input,
      inputResults,
      comboboxStatus,
      selectedOption,
      selectedOptionId,
      selectedOptionIndex,
    } = this.state;

    if (comboboxStatus === COMBOBOX_STATUS.idle && !input) return;

    // escape
    if (e.keyCode === 27) {
      e.preventDefault();
      this.closeCombobox();
    }

    // enter
    if (e.keyCode === 13) {
      e.preventDefault();
      if (!selectedOptionId) {
        return;
      }

      const { name, id } = selectedOption;
      this.chooseOption(name, id);
    }

    // up arrow
    if (e.keyCode === 38) {
      e.preventDefault();
      if (comboboxStatus === COMBOBOX_STATUS.error) {
        this.onInputChange(input);
        return;
      }

      if (comboboxStatus === COMBOBOX_STATUS.active) {
        // focus on last option from input or first option
        if (selectedOptionIndex === null || selectedOptionIndex === 0) {
          this.setState({
            selectedOption: inputResults[inputResults.length - 1],
            selectedOptionId: `results-${inputResults.length - 1}`,
            selectedOptionIndex: inputResults.length - 1,
          });
          return;
        }

        // focus on previous
        this.setState({
          selectedOption: inputResults[selectedOptionIndex - 1],
          selectedOptionId: `results-${selectedOptionIndex - 1}`,
          selectedOptionIndex: selectedOptionIndex - 1,
        });
      }
    }

    // down arrow
    if (e.keyCode === 40) {
      e.preventDefault();
      if (comboboxStatus === COMBOBOX_STATUS.error) {
        this.onInputChange(input);
        return;
      }

      if (comboboxStatus === COMBOBOX_STATUS.active) {
        // focus on first option from input or last option
        if (
          selectedOptionIndex === null ||
          selectedOptionIndex === inputResults.length - 1
        ) {
          this.setState({
            selectedOption: inputResults[0],
            selectedOptionId: `results-${0}`,
            selectedOptionIndex: 0,
          });
          return;
        }

        // focus on next
        this.setState({
          selectedOption: inputResults[selectedOptionIndex + 1],
          selectedOptionId: `results-${selectedOptionIndex + 1}`,
          selectedOptionIndex: selectedOptionIndex + 1,
        });
      }
    }
  };

  chooseOption = async (name, id) => {
    let loadingTimeout = setTimeout(() => {
      this.setState({
        comboboxLoading: COMBOBOX_STATUS.loading,
      });
    }, 250);

    // replace single option
    if (this.props.single) {
      const results = await this.props.onChosenOption(name, id);

      clearTimeout(loadingTimeout);

      if (results?.error) {
        this.closeCombobox(this.state.input, COMBOBOX_STATUS.error);
        this.setState({
          errorMessage: results.error,
        });
        return;
      }

      this.closeCombobox(name, COMBOBOX_STATUS.success);
      this.setState({ chosenOptions: [{ name, id }] });
      return;
    }

    // add option
    const results = await this.props.onChosenOption([
      ...this.state.chosenOptions,
      { name, id },
    ]);

    clearTimeout(loadingTimeout);

    if (results?.error) {
      this.closeCombobox(this.state.input, COMBOBOX_STATUS.error);
      this.setState({
        errorMessage: results.error,
      });
      return;
    }

    this.closeCombobox("", COMBOBOX_STATUS.success);
    this.setState({
      chosenOptions: [...this.state.chosenOptions, { name, id }],
    });
  };

  closeCombobox = (name = "", status = COMBOBOX_STATUS.idle) => {
    this.setState({
      input: name,
      comboboxStatus: status,
      comboboxLoading: COMBOBOX_STATUS.idle,
      inputResults: [],
      selectedOption: {},
      selectedOptionIndex: null,
      selectedOptionId: "",
    });
  };

  removeChosenOption = (optionIndex) => {
    const { input, chosenOptions } = this.state;

    // clear input when removing single
    if (this.props.single && input === chosenOptions[0]?.name) {
      this.setState({ input: "" });
    }

    // keeping refs updated when removing option
    let filteredChosenOptions = [...chosenOptions];
    let filteredChosenOptionBtnRefs = [...this.chosenOptionBtnRefs];

    filteredChosenOptions.splice(optionIndex, 1);
    filteredChosenOptionBtnRefs.splice(optionIndex, 1);

    this.chosenOptionBtnRefs = filteredChosenOptionBtnRefs;
    this.setState({
      chosenOptions: filteredChosenOptions,
      removedChosenOptionIndex: optionIndex,
    });
    this.props.onRemoveChosenOption(filteredChosenOptions);
  };

  render() {
    const { inputName, displayName } = this.props;
    const { input, inputResults, selectedOptionId, chosenOptions } = this.state;

    console.log("Status", this.state.comboboxStatus);

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
          aria-expanded={this.state.comboboxStatus === COMBOBOX_STATUS.active}
        >
          <input
            ref={this.inputRef}
            type="text"
            autoComplete="off"
            id={`${inputName}-search-input`}
            name={`${inputName}-search-input`}
            aria-describedby={`${inputName}-combobox-instructions ${inputName}-error`}
            aria-autocomplete="list"
            aria-controls="results"
            aria-activedescendant={selectedOptionId}
            value={input}
            onFocus={(e) => this.getCurrentResults(e)}
            onBlur={(e) => this.chooseSelectedOption(e)}
            onChange={(e) => this.debounceInput(e)}
            onKeyDown={(e) => this.inputFocusActions(e)}
          />
          <span id={`${inputName}-combobox-instructions`} className="sr-only">
            {`chosen ${displayName} will be listed below`}
          </span>

          {this.state.comboboxStatus === COMBOBOX_STATUS.error ? (
            <span id={`${inputName}-error`}>
              {`error with combobox. ${this.state.errorMessage}. please try again`}
            </span>
          ) : null}
        </InputContainer>

        <ResultsContainer
          aria-live="assertive"
          aria-atomic="true"
          aria-relevant="additions"
        >
          {this.state.comboboxStatus === COMBOBOX_STATUS.noResults ? (
            <>
              {this.state.shouldAnnounceResults ? (
                <span className="sr-only">showing zero results</span>
              ) : null}

              <ul
                id="results"
                role="listbox"
                aria-labelledby={`${inputName}-label`}
              >
                <li id="no-results" role="option" aria-selected="false">
                  No Results
                </li>
              </ul>
            </>
          ) : null}

          {this.state.comboboxStatus === COMBOBOX_STATUS.active ? (
            <>
              {this.state.shouldAnnounceResults ? (
                <span className="sr-only">
                  {`showing ${inputResults.length} ${
                    inputResults.length === 1 ? "result" : "results"
                  }`}
                </span>
              ) : null}

              <ul
                id="results"
                className="results-group"
                role="listbox"
                aria-labelledby={`${inputName}-label`}
              >
                {inputResults.map((option, i) => {
                  return (
                    //eslint-disable-next-line
                    <li
                      id={`results-${i}`}
                      key={option.id}
                      role="option"
                      aria-selected={selectedOptionId === `results-${i}`}
                      className={
                        selectedOptionId === `results-${i}` ? "selected" : ""
                      }
                      // prevent onblur input event so onclick can run
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => this.chooseOption(option.name, option.id)}
                    >
                      {option.name}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </ResultsContainer>
        <div>
          {chosenOptions.length > 0 ? (
            <>
              <ChosenNamesGroup aria-label={`chosen ${displayName}`}>
                {chosenOptions.map((chosenOption, i) => {
                  return (
                    <li key={chosenOption.id}>
                      <span>{chosenOption.name}</span>
                      <button
                        type="button"
                        ref={(ref) => {
                          this.setChosenOptionBtnRefs(ref, i);
                        }}
                        aria-label={`remove ${chosenOption.name}`}
                        onClick={() => this.removeChosenOption(i)}
                      >
                        <span>X</span>
                      </button>
                    </li>
                  );
                })}
              </ChosenNamesGroup>
            </>
          ) : null}
        </div>
      </div>
    );
  }
}

const InputContainer = styled.div`
  
`;

const ChosenNamesGroup = styled.ul`
  
`;

const ResultsContainer = styled.div`
  .results-group {
    position: absolute;
    z-index: 100;
    background-color: white;
  }
  .selected {
    border: solid;
    background-color: green;
  }
`;

export default Combobox;
