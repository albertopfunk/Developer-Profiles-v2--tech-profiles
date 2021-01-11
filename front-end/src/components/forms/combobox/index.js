import React from "react";
import styled from "styled-components";

class Combobox extends React.Component {
  state = {
    timeOut: null,
    input: "",
    isUsingCombobox: false,
    resultsInBank: true,
    autoCompleteResults: [],
    selectedOption: {},
    selectedOptionIndex: null,
    selectedOptionId: "",
    chosenOptions: [],
    removedChosenOptionIndex: null,
    shouldAnnounceResults: false,
  };

  chosenOptionBtnRefs = [];
  inputRef = React.createRef();
  cancelRef = React.createRef();

  componentDidMount() {
    if (this.props.chosenOptions.length > 0) {
      this.setState({ chosenOptions: this.props.chosenOptions });
    }
  }

  componentDidUpdate(prevProps) {
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
      this.cancelRef.current = "cancel";
      this.closeCombobox();
      return;
    }

    let results = await this.props.onInputChange(value);

    if (this.cancelRef.current === "cancel") {
      return;
    }

    if (results.length === 0) {
      this.setState({
        input: value,
        autoCompleteResults: [],
        resultsInBank: false,
        isUsingCombobox: true,
        selectedOption: {},
        selectedOptionIndex: null,
        selectedOptionId: "",
        shouldAnnounceResults: true,
      });
      return;
    }

    this.setState({
      resultsInBank: true,
      isUsingCombobox: true,
      selectedOption: {},
      selectedOptionIndex: null,
      selectedOptionId: "",
      autoCompleteResults: results,
      shouldAnnounceResults: true,
    });
  };

  debounceInput = (e) => {
    this.cancelRef.current = "ok";
    let currTimeOut;

    const { value } = e.target;
    this.setState({
      input: value,
      shouldAnnounceResults: false,
    });

    if (this.state.timeOut) {
      clearTimeout(this.state.timeOut);
    }

    currTimeOut = setTimeout(() => {
      this.setState({ timeOut: null });
      this.onInputChange(value);
    }, 350);

    this.setState({ timeOut: currTimeOut });
  };

  getCurrentResults = (e) => {
    const { value } = e.target;

    if (!value) {
      return;
    }

    if (this.props.single) {
      if (this.state.chosenOptions.length === 0) {
        this.onInputChange(value);
        return;
      }

      // shouldn't fetch if single has chosen option
      if (value === this.state.chosenOptions[0].name) {
        return;
      }
    }

    this.onInputChange(value);
  };

  inputBlurAction(e) {
    if (this.state.selectedOptionIndex === null && this.state.isUsingCombobox) {
      this.closeCombobox(e.target.value);
      return;
    }

    if (this.state.selectedOptionId && this.state.isUsingCombobox) {
      const { name, id } = this.state.selectedOption;
      this.chooseOption(name, id);
    }
  }

  inputFocusActions = (e) => {
    if (this.state.autoCompleteResults.length === 0) {
      return;
    }

    // up arrow
    if (e.keyCode === 38) {
      e.preventDefault();

      if (
        this.state.selectedOptionIndex === null ||
        this.state.selectedOptionIndex === 0
      ) {
        this.setState({
          selectedOption: this.state.autoCompleteResults[
            this.state.autoCompleteResults.length - 1
          ],
          selectedOptionId: `results-${
            this.state.autoCompleteResults.length - 1
          }`,
          selectedOptionIndex: this.state.autoCompleteResults.length - 1,
        });
        return;
      }

      this.setState({
        selectedOption: this.state.autoCompleteResults[
          this.state.selectedOptionIndex - 1
        ],
        selectedOptionId: `results-${this.state.selectedOptionIndex - 1}`,
        selectedOptionIndex: this.state.selectedOptionIndex - 1,
      });
    }

    // down arrow
    if (e.keyCode === 40) {
      e.preventDefault();

      if (
        this.state.selectedOptionIndex === null ||
        this.state.selectedOptionIndex ===
          this.state.autoCompleteResults.length - 1
      ) {
        this.setState({
          selectedOption: this.state.autoCompleteResults[0],
          selectedOptionId: `results-${0}`,
          selectedOptionIndex: 0,
        });
        return;
      }

      this.setState({
        selectedOption: this.state.autoCompleteResults[
          this.state.selectedOptionIndex + 1
        ],
        selectedOptionId: `results-${this.state.selectedOptionIndex + 1}`,
        selectedOptionIndex: this.state.selectedOptionIndex + 1,
      });
    }

    // escape
    if (e.keyCode === 27) {
      e.preventDefault();
      this.closeCombobox();
    }

    // enter
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.state.selectedOptionIndex === null) {
        return;
      }

      const { name, id } = this.state.selectedOption;
      this.chooseOption(name, id);
    }
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
      selectedOption: {},
      selectedOptionIndex: null,
      selectedOptionId: "",
      resultsInBank: true,
    });
  };

  removeChosenOption = (optionIndex) => {
    if (this.props.single && !this.state.isUsingCombobox) {
      this.setState({ input: "" });
    }

    let filteredChosenOptions = [...this.state.chosenOptions];
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
    const {
      input,
      resultsInBank,
      autoCompleteResults,
      isUsingCombobox,
      selectedOptionId,
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
            aria-activedescendant={selectedOptionId}
            value={input}
            onFocus={(e) => this.getCurrentResults(e)}
            onBlur={(e) => this.inputBlurAction(e)}
            onChange={(e) => this.debounceInput(e)}
            onKeyDown={(e) => this.inputFocusActions(e)}
          />
          <span id={`${inputName}-combobox-instructions`} className="sr-only">
            {`chosen ${displayName} will be listed below`}
          </span>
        </InputContainer>

        <ResultsContainer
          aria-live="assertive"
          aria-atomic="true"
          aria-relevant="additions"
        >
          {!resultsInBank && input ? (
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

          {resultsInBank && autoCompleteResults.length > 0 ? (
            <>
              {this.state.shouldAnnounceResults ? (
                <span className="sr-only">
                  {`showing ${autoCompleteResults.length} ${
                    autoCompleteResults.length === 1 ? "result" : "results"
                  }`}
                </span>
              ) : null}

              <ul
                id="results"
                className="results-group"
                role="listbox"
                aria-labelledby={`${inputName}-label`}
              >
                {autoCompleteResults.map((option, i) => {
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
