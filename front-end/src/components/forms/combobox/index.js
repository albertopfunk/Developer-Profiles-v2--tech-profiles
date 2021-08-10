import React from "react";
import styled from "styled-components";
import {
  CANCEL_STATUS,
  COMBOBOX_STATUS,
} from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

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
    removeChosenOptionToggle: true
  };

  chosenOptionBtnRefs = [];
  inputRef = React.createRef();
  asyncCancelRef = React.createRef();

  componentDidMount() {
    if (this.props.chosenOptions?.length > 0) {
      this.setState({ chosenOptions: this.props.chosenOptions });
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.removeChosenOptionToggle !== prevState.removeChosenOptionToggle) {
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

  removeChosenOptionFocusManagement = (e, index) => {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    this.setState(prevState => {
      return { removeChosenOptionToggle: !prevState.removeChosenOptionToggle };
    });

    this.removeChosenOption(index);
  }

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
          {displayName}:
        </label>
        <Spacer axis="vertical" size="5" />
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
            data-input
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
                className="results-group"
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
                      className={`result ${
                        selectedOptionId === `results-${i}` ? "selected" : ""
                      }`}
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
        <Spacer axis="vertical" size="10" />
        <ChosenOptionsContainer>
          {chosenOptions.length > 0 ? (
            <>
              <ul
                className="chosen-options-group"
                aria-label={`chosen ${displayName}`}
              >
                {chosenOptions.map((chosenOption, i) => {
                  return (
                    <li key={chosenOption.id} className="chosen-option">
                      <span>{chosenOption.name}</span>
                      <button
                        type="button"
                        className="button remove-button"
                        ref={(ref) => {
                          this.setChosenOptionBtnRefs(ref, i);
                        }}
                        onClick={() => this.removeChosenOption(i)}
                        onKeyDown={(e) => this.removeChosenOptionFocusManagement(e, i)}
                      >
                        <span className="sr-only">
                          remove {chosenOption.name}
                        </span>
                        <RemoveIcon className="button-icon" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </ChosenOptionsContainer>
      </div>
    );
  }
}

const InputContainer = styled.div``;

const ResultsContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;

  .results-group {
    position: absolute;
    width: 100%;
    border: solid 2px rgba(229, 231, 235, 0.8);
    border-top: none;
    background-color: white;
    padding: 5px;

    /* first */
    z-index: 10;

    .result {
      padding: 2px;

      &.selected {
        outline-style: solid;
        outline-width: 2px;
        outline-color: #2727ad;
      }
    }
  }
`;

const ChosenOptionsContainer = styled.div`
  .chosen-options-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .chosen-option {
      border-radius: 10px;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      padding: 5px;

      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 3px;

      .remove-button {
        width: 25px;
        height: 25px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:focus-visible {
          outline-width: 3px;
          outline-color: transparent;
          box-shadow: inset 0 0 1px 2.5px #2727ad;
        }

        &:hover .icon {
          fill: #2727ad;
        }

        .button-icon {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
`;

export default Combobox;
