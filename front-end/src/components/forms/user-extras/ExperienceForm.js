import React from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

import IconButton from "../buttons/IconButton";

import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

const ExperienceForm = React.forwardRef(
  (
    {
      expIndex,
      currentYear,
      userId,
      userCompanyName,
      company,
      userJobTitle,
      title,
      userFromYear,
      userFromMonth,
      userToYear,
      userToMonth,
      userToPresent,
      dates,
      userDescription,
      description,
      updateExperience,
      removeExperienceFocusManagement,
      removeExperience,
      isSubmitting,
    },
    removeBtnRef
  ) => {
    let presentRef = React.createRef();

    function setCompanyInput(value) {
      if (value === userCompanyName) {
        updateExperience(
          expIndex,
          {
            companyNameInput: value,
            companyChange: false,
            companyStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        companyNameInput: value,
        companyChange: true,
      });
    }

    function validateCompany(value) {
      if (isSubmitting.current) return;
      if (!company.companyChange && value) return;
      if (value.trim() === "") {
        updateExperience(expIndex, {
          companyNameInput: "",
          companyStatus: FORM_STATUS.error,
        });
      } else if (validateInput("title", value)) {
        updateExperience(expIndex, {
          companyStatus: FORM_STATUS.success,
        });
      } else {
        updateExperience(expIndex, {
          companyStatus: FORM_STATUS.error,
        });
      }
    }

    function setTitleInput(value) {
      if (value === userJobTitle) {
        updateExperience(
          expIndex,
          {
            titleInput: value,
            titleChange: false,
            titleStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        titleInput: value,
        titleChange: true,
      });
    }

    function validateTitle(value) {
      if (isSubmitting.current) return;
      if (!title.titleChange && value) return;
      if (value.trim() === "") {
        updateExperience(expIndex, {
          titleInput: "",
          titleStatus: FORM_STATUS.error,
        });
      } else if (validateInput("title", value)) {
        updateExperience(expIndex, {
          titleStatus: FORM_STATUS.success,
        });
      } else {
        updateExperience(expIndex, {
          titleStatus: FORM_STATUS.error,
        });
      }
    }

    function setFromMonthDate(value) {
      if (value === userFromMonth) {
        updateExperience(
          expIndex,
          {
            fromMonth: value,
            fromMonthStatus: FORM_STATUS.idle,
            fromMonthChange: false,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        fromMonth: value,
        fromMonthChange: true,
      });
    }

    function validateFromMonthDate(value) {
      if (isSubmitting.current) return;
      if (!dates.fromMonthChange && value) return;

      if (value === "") {
        updateExperience(expIndex, {
          fromMonthStatus: FORM_STATUS.error,
        });
      } else {
        updateExperience(expIndex, {
          fromMonthStatus: FORM_STATUS.success,
        });
      }
    }

    function setFromYearDate(value) {
      if (value === userFromYear) {
        updateExperience(
          expIndex,
          {
            fromYear: value,
            fromYearStatus: FORM_STATUS.idle,
            fromYearChange: false,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        fromYear: value,
        fromYearChange: true,
      });
    }

    function validateFromYearDate(value) {
      if (isSubmitting.current) return;
      if (!dates.fromYearChange && value) return;

      if (value === "") {
        updateExperience(expIndex, {
          fromYearStatus: FORM_STATUS.error,
        });
      } else {
        updateExperience(expIndex, {
          fromYearStatus: FORM_STATUS.success,
        });
      }
    }

    function setToMonthDate(value) {
      if (value === userToMonth) {
        updateExperience(
          expIndex,
          {
            toMonth: value,
            toMonthStatus: FORM_STATUS.idle,
            toMonthChange: false,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        toMonth: value,
        toMonthChange: true,
      });
    }

    function validateToMonthDate(value) {
      if (isSubmitting.current) return;
      if (!dates.toMonthChange && value) return;

      if (value === "") {
        updateExperience(expIndex, {
          toMonthStatus: FORM_STATUS.error,
        });
      } else {
        updateExperience(expIndex, {
          toMonthStatus: FORM_STATUS.success,
        });
      }
    }

    function setToYearDate(value) {
      if (value === userToYear) {
        updateExperience(
          expIndex,
          {
            toYear: value,
            toYearStatus: FORM_STATUS.idle,
            toYearChange: false,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        toYear: value,
        toYearChange: true,
      });
    }

    function validateToYearDate(value) {
      if (isSubmitting.current) return;
      if (!dates.toYearChange && value) return;

      if (value === "") {
        updateExperience(expIndex, {
          toYearStatus: FORM_STATUS.error,
        });
      } else {
        updateExperience(expIndex, {
          toYearStatus: FORM_STATUS.success,
        });
      }
    }

    function setToPresentDate() {
      if (presentRef.current.checked) {
        if (userToPresent === "Present") {
          updateExperience(
            expIndex,
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

        updateExperience(expIndex, {
          toPresent: "Present",
          toMonthStatus: FORM_STATUS.success,
          toMonthChange: true,
          toYearStatus: FORM_STATUS.success,
          toYearChange: true,
        });
      } else {
        if (userToPresent === "") {
          updateExperience(
            expIndex,
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

        updateExperience(expIndex, {
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
        updateExperience(
          expIndex,
          {
            descriptionInput: value,
            descriptionChange: false,
            descriptionStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateExperience(expIndex, {
        descriptionInput: value,
        descriptionChange: true,
      });
    }

    function validateDescription(value) {
      if (isSubmitting.current) return;
      if (!description.descriptionChange && value) return;
      if (value.trim() === "") {
        updateExperience(expIndex, {
          descriptionInput: "",
          descriptionStatus: FORM_STATUS.error,
        });
      } else if (validateInput("summary", value)) {
        updateExperience(expIndex, {
          descriptionStatus: FORM_STATUS.success,
        });
      } else {
        updateExperience(expIndex, {
          descriptionStatus: FORM_STATUS.error,
        });
      }
    }

    return (
      <Fieldset>
        <div className="info-heading">
          <legend>
            Experience: {company.companyNameInput || "New Company"}
          </legend>
          <IconButton
            ref={removeBtnRef}
            type="button"
            size="sm"
            ariaLabel={`Remove ${company.companyNameInput || "New"} Company`}
            icon={<RemoveIcon className="icon" />}
            onClick={() => removeExperience(expIndex)}
            onKeyDown={(e) => removeExperienceFocusManagement(e, expIndex)}
          />
        </div>

        <Spacer axis="vertical" size="5" />

        <InputContainer>
          <label htmlFor={`company-${userId}`}>Company:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            autoComplete="organization"
            id={`company-${userId}`}
            data-input
            name="company"
            className={`input ${
              company.companyStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`company-${userId}-error company-${userId}-success`}
            aria-invalid={
              company.companyNameInput.trim() === "" ||
              company.companyStatus === FORM_STATUS.error
            }
            value={company.companyNameInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            onBlur={(e) => validateCompany(e.target.value)}
          />
          {company.companyStatus === FORM_STATUS.error ? (
            <span id={`company-${userId}-error`} className="err-mssg">
              Input is required. Company can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {company.companyStatus === FORM_STATUS.success ? (
            <span id={`company-${userId}-success`} className="success-mssg">
              Company is Validated
            </span>
          ) : null}
        </InputContainer>
        <Spacer axis="vertical" size="20" />
        <InputContainer>
          <label htmlFor={`title-${userId}`}>Title:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            autoComplete="organization-title"
            id={`title-${userId}`}
            data-input
            name="title"
            className={`input ${
              title.titleStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`title-${userId}-error title-${userId}-success`}
            aria-invalid={
              title.titleInput.trim() === "" ||
              title.titleStatus === FORM_STATUS.error
            }
            value={title.titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={(e) => validateTitle(e.target.value)}
          />
          {title.titleStatus === FORM_STATUS.error ? (
            <span id={`title-${userId}-error`} className="err-mssg">
              Input is required. Title can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {title.titleStatus === FORM_STATUS.success ? (
            <span id={`title-${userId}-success`} className="success-mssg">
              Title is Validated
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
    gap: 4px;
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

ExperienceForm.displayName = "ExperienceForm";

export default ExperienceForm;
