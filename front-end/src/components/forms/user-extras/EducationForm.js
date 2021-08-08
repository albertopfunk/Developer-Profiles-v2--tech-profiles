import React from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

const EducationForm = React.forwardRef(
  (
    {
      eduIndex,
      currentYear,
      userId,
      userSchool,
      school,
      userFieldOfStudy,
      fieldOfStudy,
      userFromYear,
      userFromMonth,
      userToYear,
      userToMonth,
      userToPresent,
      dates,
      userDescription,
      description,
      updateEducation,
      removeEducationFocusManagement,
      removeEducation,
      isSubmitting,
    },
    removeBtnRef
  ) => {
    let presentRef = React.createRef();

    function setSchoolInput(value) {
      if (value === userSchool) {
        updateEducation(
          eduIndex,
          {
            schoolNameInput: value,
            schoolChange: false,
            schoolStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        schoolNameInput: value,
        schoolChange: true,
      });
    }

    function validateSchool(value) {
      if (isSubmitting.current) return;
      if (!school.schoolChange && value) return;
      if (value.trim() === "") {
        updateEducation(eduIndex, {
          schoolNameInput: "",
          schoolStatus: FORM_STATUS.error,
        });
      } else if (validateInput("title", value)) {
        updateEducation(eduIndex, {
          schoolStatus: FORM_STATUS.success,
        });
      } else {
        updateEducation(eduIndex, {
          schoolStatus: FORM_STATUS.error,
        });
      }
    }

    function setFieldOfStudyInput(value) {
      if (value === userFieldOfStudy) {
        updateEducation(
          eduIndex,
          {
            fieldOfStudyInput: value,
            fieldOfStudyChange: false,
            fieldOfStudyStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        fieldOfStudyInput: value,
        fieldOfStudyChange: true,
      });
    }

    function validateFieldOfStudy(value) {
      if (isSubmitting.current) return;
      if (!fieldOfStudy.fieldOfStudyChange && value) return;
      if (value.trim() === "") {
        updateEducation(eduIndex, {
          fieldOfStudyInput: "",
          fieldOfStudyStatus: FORM_STATUS.error,
        });
      } else if (validateInput("title", value)) {
        updateEducation(eduIndex, {
          fieldOfStudyStatus: FORM_STATUS.success,
        });
      } else {
        updateEducation(eduIndex, {
          fieldOfStudyStatus: FORM_STATUS.error,
        });
      }
    }

    function setFromMonthDate(value) {
      if (value === userFromMonth) {
        updateEducation(
          eduIndex,
          {
            fromMonth: value,
            fromMonthStatus: FORM_STATUS.idle,
            fromMonthChange: false,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        fromMonth: value,
        fromMonthChange: true,
      });
    }

    function validateFromMonthDate(value) {
      if (isSubmitting.current) return;
      if (!dates.fromMonthChange && value) return;

      if (value === "") {
        updateEducation(eduIndex, {
          fromMonthStatus: FORM_STATUS.error,
        });
      } else {
        updateEducation(eduIndex, {
          fromMonthStatus: FORM_STATUS.success,
        });
      }
    }

    function setFromYearDate(value) {
      if (value === userFromYear) {
        updateEducation(
          eduIndex,
          {
            fromYear: value,
            fromYearStatus: FORM_STATUS.idle,
            fromYearChange: false,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        fromYear: value,
        fromYearChange: true,
      });
    }

    function validateFromYearDate(value) {
      if (isSubmitting.current) return;
      if (!dates.fromYearChange && value) return;

      if (value === "") {
        updateEducation(eduIndex, {
          fromYearStatus: FORM_STATUS.error,
        });
      } else {
        updateEducation(eduIndex, {
          fromYearStatus: FORM_STATUS.success,
        });
      }
    }

    function setToMonthDate(value) {
      if (value === userToMonth) {
        updateEducation(
          eduIndex,
          {
            toMonth: value,
            toMonthStatus: FORM_STATUS.idle,
            toMonthChange: false,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        toMonth: value,
        toMonthChange: true,
      });
    }

    function validateToMonthDate(value) {
      if (isSubmitting.current) return;
      if (!dates.toMonthChange && value) return;

      if (value === "") {
        updateEducation(eduIndex, {
          toMonthStatus: FORM_STATUS.error,
        });
      } else {
        updateEducation(eduIndex, {
          toMonthStatus: FORM_STATUS.success,
        });
      }
    }

    function setToYearDate(value) {
      if (value === userToYear) {
        updateEducation(
          eduIndex,
          {
            toYear: value,
            toYearStatus: FORM_STATUS.idle,
            toYearChange: false,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        toYear: value,
        toYearChange: true,
      });
    }

    function validateToYearDate(value) {
      if (isSubmitting.current) return;
      if (!dates.toYearChange && value) return;

      if (value === "") {
        updateEducation(eduIndex, {
          toYearStatus: FORM_STATUS.error,
        });
      } else {
        updateEducation(eduIndex, {
          toYearStatus: FORM_STATUS.success,
        });
      }
    }

    function setToPresentDate() {
      if (presentRef.current.checked) {
        if (userToPresent === "Present") {
          updateEducation(
            eduIndex,
            {
              toPresent: "Present",
              toMonthStatus: FORM_STATUS.idle,
              toMonthChange: false,
              toYearStatus: FORM_STATUS.idle,
              toYearChange: false,
            },
            true
          );
          return;
        }

        updateEducation(eduIndex, {
          toPresent: "Present",
          toMonthStatus: FORM_STATUS.success,
          toMonthChange: true,
          toYearStatus: FORM_STATUS.success,
          toYearChange: true,
        });
      } else {
        if (userToPresent === "") {
          updateEducation(
            eduIndex,
            {
              toPresent: "",
              toMonthStatus: FORM_STATUS.idle,
              toMonthChange: false,
              toYearStatus: FORM_STATUS.idle,
              toYearChange: false,
            },
            true
          );
          return;
        }

        // validate to-dates
        let toMonthStatus;
        let toMonthChange;
        let toYearStatus;
        let toYearChange;

        if (dates.toMonth && dates.toMonth === userToMonth) {
          toMonthStatus = FORM_STATUS.idle;
          toMonthChange = false;
        } else if (!dates.toMonth) {
          toMonthStatus = FORM_STATUS.error;
          toMonthChange = true;
        } else {
          toMonthStatus = FORM_STATUS.success;
          toMonthChange = true;
        }

        if (dates.toYear && dates.toYear === userToYear) {
          toYearStatus = FORM_STATUS.idle;
          toYearChange = false;
        } else if (!dates.toYear) {
          toYearStatus = FORM_STATUS.error;
          toYearChange = true;
        } else {
          toYearStatus = FORM_STATUS.success;
          toYearChange = true;
        }

        updateEducation(eduIndex, {
          toPresent: "",
          toMonthStatus,
          toMonthChange,
          toYearStatus,
          toYearChange,
        });
      }
    }

    function setDescriptionInput(value) {
      if (value === userDescription) {
        updateEducation(
          eduIndex,
          {
            descriptionInput: value,
            descriptionChange: false,
            descriptionStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateEducation(eduIndex, {
        descriptionInput: value,
        descriptionChange: true,
      });
    }

    function validateDescription(value) {
      if (isSubmitting.current) return;
      if (!description.descriptionChange && value) return;
      if (value.trim() === "") {
        updateEducation(eduIndex, {
          descriptionInput: "",
          descriptionStatus: FORM_STATUS.error,
        });
      } else if (validateInput("summary", value)) {
        updateEducation(eduIndex, {
          descriptionStatus: FORM_STATUS.success,
        });
      } else {
        updateEducation(eduIndex, {
          descriptionStatus: FORM_STATUS.error,
        });
      }
    }

    return (
      <Fieldset>
        <div className="info-heading">
          <legend>
            Education: {school.schoolNameInput || "New Education"}
          </legend>

          <button
            ref={removeBtnRef}
            type="button"
            className="button remove-button"
            aria-label={`Remove ${school.schoolNameInput || "New"} Education`}
            onClick={() => removeEducation(eduIndex)}
            onKeyDown={(e) => removeEducationFocusManagement(e, eduIndex)}
          >
            <span className="sr-only">Remove Project</span>
            <span className="button-icon">
              <RemoveIcon className="icon" />
            </span>
          </button>
        </div>
        <Spacer axis="vertical" size="5" />
        <InputContainer>
          <label htmlFor={`school-${userId}`}>School:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            id={`school-${userId}`}
            data-input
            name="school"
            className={`input ${
              school.schoolStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`school-${userId}-error school-${userId}-success`}
            aria-invalid={
              school.schoolNameInput.trim() === "" ||
              school.schoolStatus === FORM_STATUS.error
            }
            value={school.schoolNameInput}
            onChange={(e) => setSchoolInput(e.target.value)}
            onBlur={(e) => validateSchool(e.target.value)}
          />
          {school.schoolStatus === FORM_STATUS.error ? (
            <span id={`school-${userId}-error`} className="err-mssg">
              Input is required. School can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {school.schoolStatus === FORM_STATUS.success ? (
            <span id={`school-${userId}-success`} className="success-mssg">
              School is Validated
            </span>
          ) : null}
        </InputContainer>
        <Spacer axis="vertical" size="20" />
        <InputContainer>
          <label htmlFor={`field-of-study-${userId}`}>Field of Study:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            id={`field-of-study-${userId}`}
            data-input
            name="field-of-study"
            className={`input ${
              fieldOfStudy.fieldOfStudyStatus === FORM_STATUS.error
                ? "input-err"
                : ""
            }`}
            aria-describedby={`field-of-study-${userId}-error field-of-study-${userId}-success`}
            aria-invalid={
              fieldOfStudy.fieldOfStudyInput.trim() === "" ||
              fieldOfStudy.fieldOfStudyStatus === FORM_STATUS.error
            }
            value={fieldOfStudy.fieldOfStudyInput}
            onChange={(e) => setFieldOfStudyInput(e.target.value)}
            onBlur={(e) => validateFieldOfStudy(e.target.value)}
          />
          {fieldOfStudy.fieldOfStudyStatus === FORM_STATUS.error ? (
            <span id={`field-of-study-${userId}-error`} className="err-mssg">
              Input is required. field of study can only be alphabelical
              characters, no numbers
            </span>
          ) : null}
          {fieldOfStudy.fieldOfStudyStatus === FORM_STATUS.success ? (
            <span
              id={`field-of-study-${userId}-success`}
              className="success-mssg"
            >
              field of study is Validated
            </span>
          ) : null}
        </InputContainer>
        <Spacer axis="vertical" size="20" />
        <DatesContainer>
          <InputContainer>
            <label htmlFor={`from-month-${userId}`}>From Month:</label>
            <Spacer axis="vertical" size="5" />
            <select
              name="from-month"
              id={`from-month-${userId}`}
              defaultValue={userFromMonth}
              className={`input ${
                dates.fromMonthStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby={`from-month-${userId}-error from-month-${userId}-success`}
              aria-invalid={
                dates.fromMonth === "" ||
                dates.fromMonthStatus === FORM_STATUS.error
              }
              onChange={(e) => setFromMonthDate(e.target.value)}
              onBlur={(e) => validateFromMonthDate(e.target.value)}
            >
              <option value="">--Select Month--</option>
              <option value="January">01 | January</option>
              <option value="February">02 | February</option>
              <option value="March">03 | March</option>
              <option value="April">04 | April</option>
              <option value="May">05 | May</option>
              <option value="June">06 | June</option>
              <option value="July">07 | July</option>
              <option value="August">08 | August</option>
              <option value="September">09 | September</option>
              <option value="October">10 | October</option>
              <option value="November">11 | November</option>
              <option value="December">12 | December</option>
            </select>
            {dates.fromMonthStatus === FORM_STATUS.error ? (
              <span id={`from-month-${userId}-error`} className="err-mssg">
                month is required
              </span>
            ) : null}
            {dates.fromMonthStatus === FORM_STATUS.success ? (
              <span
                id={`from-month-${userId}-success`}
                className="success-mssg"
              >
                month is Validated
              </span>
            ) : null}
          </InputContainer>
          <InputContainer>
            <label htmlFor={`from-year-${userId}`}>From Year:</label>
            <Spacer axis="vertical" size="5" />
            <select
              name="from-year"
              id={`from-year-${userId}`}
              defaultValue={userFromYear}
              className={`input ${
                dates.fromYearStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby={`from-year-${userId}-error from-year-${userId}-success`}
              aria-invalid={
                dates.fromYear === "" ||
                dates.fromYearStatus === FORM_STATUS.error
              }
              onChange={(e) => setFromYearDate(e.target.value)}
              onBlur={(e) => validateFromYearDate(e.target.value)}
            >
              <option value="">--Select Year--</option>
              {Array.from(Array(50)).map((_, i) => (
                <option key={`${i}-${userId}`} value={currentYear - i}>
                  {currentYear - i}
                </option>
              ))}
            </select>
            {dates.fromYearStatus === FORM_STATUS.error ? (
              <span id={`from-year-${userId}-error`} className="err-mssg">
                year is required
              </span>
            ) : null}
            {dates.fromYearStatus === FORM_STATUS.success ? (
              <span id={`from-year-${userId}-success`} className="success-mssg">
                year is Validated
              </span>
            ) : null}
          </InputContainer>
        </DatesContainer>
        <Spacer axis="vertical" size="20" />
        <DatesContainer>
          <InputContainer>
            <label htmlFor={`to-month-${userId}`}>To Month:</label>
            <Spacer axis="vertical" size="5" />
            <select
              disabled={dates.toPresent === "Present"}
              name="to-month"
              id={`to-month-${userId}`}
              defaultValue={userToMonth}
              className={`input ${
                dates.toMonthStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby={`to-month-${userId}-error to-month-${userId}-success`}
              aria-invalid={
                dates.toMonth === "" ||
                dates.toMonthStatus === FORM_STATUS.error
              }
              onChange={(e) => setToMonthDate(e.target.value)}
              onBlur={(e) => validateToMonthDate(e.target.value)}
            >
              <option value="">--Select Month--</option>
              <option value="January">01 | January</option>
              <option value="February">02 | February</option>
              <option value="March">03 | March</option>
              <option value="April">04 | April</option>
              <option value="May">05 | May</option>
              <option value="June">06 | June</option>
              <option value="July">07 | July</option>
              <option value="August">08 | August</option>
              <option value="September">09 | September</option>
              <option value="October">10 | October</option>
              <option value="November">11 | November</option>
              <option value="December">12 | December</option>
            </select>
            {dates.toMonthStatus === FORM_STATUS.error ? (
              <span id={`to-month-${userId}-error`} className="err-mssg">
                month is required
              </span>
            ) : null}
            {dates.toMonthStatus === FORM_STATUS.success ? (
              <span id={`to-month-${userId}-success`} className="success-mssg">
                month is Validated
              </span>
            ) : null}
          </InputContainer>
          <InputContainer>
            <label htmlFor={`to-year-${userId}`}>To Year:</label>
            <Spacer axis="vertical" size="5" />
            <select
              disabled={dates.toPresent === "Present"}
              name="to-year"
              id={`to-year-${userId}`}
              defaultValue={userToYear}
              className={`input ${
                dates.toYearStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby={`to-year-${userId}-error to-year-${userId}-success`}
              aria-invalid={
                dates.toYear === "" || dates.toYearStatus === FORM_STATUS.error
              }
              onChange={(e) => setToYearDate(e.target.value)}
              onBlur={(e) => validateToYearDate(e.target.value)}
            >
              <option value="">--Select Year--</option>
              {Array.from(Array(50)).map((_, i) => (
                <option key={`${i}-${userId}`} value={currentYear - i}>
                  {currentYear - i}
                </option>
              ))}
            </select>
            {dates.toYearStatus === FORM_STATUS.error ? (
              <span id={`to-year-${userId}-error`} className="err-mssg">
                year is required
              </span>
            ) : null}
            {dates.toYearStatus === FORM_STATUS.success ? (
              <span id={`to-year-${userId}-success`} className="success-mssg">
                year is Validated
              </span>
            ) : null}
          </InputContainer>
          <div className="present-container">
            <input
              ref={presentRef}
              type="checkbox"
              id={`to-present-${userId}`}
              name="to-present"
              onChange={setToPresentDate}
              checked={dates.toPresent === "Present"}
            />
            <label htmlFor={`present-${userId}`}>Present</label>
          </div>
        </DatesContainer>
        <Spacer axis="vertical" size="20" />
        <InputContainer>
          <label htmlFor={`description-${userId}`}>Description:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            id={`description-${userId}`}
            data-input
            name="description"
            className={`input ${
              description.descriptionStatus === FORM_STATUS.error
                ? "input-err"
                : ""
            }`}
            aria-describedby={`description-${userId}-error description-${userId}-success`}
            aria-invalid={
              description.descriptionInput.trim() === "" ||
              description.descriptionStatus === FORM_STATUS.error
            }
            value={description.descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            onBlur={(e) => validateDescription(e.target.value)}
          />
          {description.descriptionStatus === FORM_STATUS.error ? (
            <span id={`description-${userId}-error`} className="err-mssg">
              Input is required. description can only be alphabelical
              characters, no numbers
            </span>
          ) : null}
          {description.descriptionStatus === FORM_STATUS.success ? (
            <span id={`description-${userId}-success`} className="success-mssg">
              description is Validated
            </span>
          ) : null}
        </InputContainer>
      </Fieldset>
    );
  }
);

const Fieldset = styled.fieldset`
  min-width: 0;

  .info-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .remove-button {
      width: 30px;
      height: 30px;
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
        display: inline-block;

        .icon {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
`;

const DatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 400px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
  }

  .present-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  .input-err {
    border: solid red;
  }
  .err-mssg {
    color: red;
    font-size: 0.7rem;
  }
  .success-mssg {
    color: green;
    font-size: 0.7rem;
  }
`;

EducationForm.displayName = "EducationForm";

export default EducationForm;
