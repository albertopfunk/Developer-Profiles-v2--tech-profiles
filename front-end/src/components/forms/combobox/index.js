import React from "react";
import styled from "styled-components";

/*

new design

focus always stays on input
use state to keep track of current selection of options
keyboard events will come from input
do not need option keyboard events

keyboard events
from input
up/down - traverse
esc - cancel

left/right/home/end
i think these are handled by input defaults

enter
prevent default to not submit
if no option is selected then return
if option selected, choose option


tab - tab to next, if an option is highlighted, option will be selected

-
since option still not on dom when tab pressed, preventDefault, and use
useeffect to focus on new chosen item
if no options are selected, and input is not empty, do not clear input

css only to show selected option

-
on focus
if input is not empty, automatically show current options

add new state to keep track of current selected option
save full object
u can add style class if option.name/id === selectedOption.name/id

traversing
need to keep track of current option array index
use index to update selectedOption

option onClick
I think this will stay the same

-
announcing
since u are no longer focusing on options
will need to be aria live, using text change

-
this will also now handle chosen options announcement
u will do this with focus
when user chooses an option(no matter what way), focus on chosen option
when user removes an option, focus on next option
if no options left, focus back on input


*/

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
    shouldAnnounce: false,
  };

  componentDidMount() {
    if (this.props.chosenOptions) {
      this.setState({ chosenOptions: this.props.chosenOptions });
    }
  }

  onInputChange = async (value) => {
    /*
      first debounce with value runs, the promise is pending
      second debounce with no value runs, this.closeCombobox runs
      second input runs first, then when resolved, the first input
      runs second, rendering the results
      this is going to be a matter of needing to cancel a request
    */

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
        selectedOption: {},
        selectedOptionIndex: null,
        selectedOptionId: "",
        shouldAnnounce: true,
      });
      return;
    }

    this.setState({
      resultsInBank: true,
      isUsingCombobox: true,
      autoCompleteResults: results,
      shouldAnnounce: true,
    });
  };

  debounceInput = (e) => {
    let currTimeOut;

    const { value } = e.target;
    this.setState({
      input: value,
      shouldAnnounce: false,
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

  inputFocusGetResults = (e) => {
    if (this.props.single) {
      return
    }

    if (this.state.input) {
      this.onInputChange(e.target.value)
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

    // tab
    if (e.keyCode === 9) {
      if (this.state.selectedOptionIndex === null) {
        this.closeCombobox(e.target.value);
      } else {
        const { name, id } = this.state.selectedOption;
        this.chooseOption(name, id);
      }
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

  removeChosenOption = (location) => {
    let filteredChosenOptions = this.state.chosenOptions.filter(
      (chosenOption) => {
        return chosenOption.name !== location.name;
      }
    );

    if (this.props.single && !this.state.isUsingCombobox) {
      this.setState({ input: "" });
    }

    this.setState({ chosenOptions: filteredChosenOptions });
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
            onFocus={(e) => this.inputFocusGetResults(e)}
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
              {this.state.shouldAnnounce ? (
                <span className="sr-only">showing zero results</span>
              ) : null}

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
              {this.state.shouldAnnounce ? (
                <span className="sr-only">
                  {`showing ${autoCompleteResults.length} ${
                    autoCompleteResults.length === 1 ? "result" : "results"
                  }`}
                </span>
              ) : null}

              <ul
                id="results"
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
  .selected {
    border: solid;
    background-color: green;
  }
`;

export default Combobox;
