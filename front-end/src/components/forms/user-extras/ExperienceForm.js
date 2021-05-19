import React, { useState } from "react";
import styled from "styled-components";

import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";

const ExperienceForm = React.forwardRef(
  (
    {
      expIndex,
      currentYear,
      userId,
      userCompanyName,
      userJobTitle,
      userFromYear,
      userFromMonth,
      userToYear,
      userToMonth,
      userToPresent,
      userDescription,
      updateExperience,
      removeExperience,
    },
    removeBtnRef
  ) => {
    const [company, setCompany] = useState({
      companyNameInput: userCompanyName,
      companyChange: false,
      companyStatus: FORM_STATUS.idle,
    });

    const [title, setTitle] = useState({
      titleInput: userJobTitle,
      titleChange: false,
      titleStatus: FORM_STATUS.idle,
    });

    const [dates, setDates] = useState({
      fromYear: userFromYear,
      fromYearStatus: FORM_STATUS.idle,
      fromMonth: userFromMonth,
      fromMonthStatus: FORM_STATUS.idle,
      toYear: userToYear,
      toYearStatus: FORM_STATUS.idle,
      toMonth: userToMonth,
      toMonthStatus: FORM_STATUS.idle,
      toPresent: userToPresent,
      dateChange: false,
    });

    const [description, setDescription] = useState({
      descriptionInput: userDescription,
      descriptionChange: false,
      descriptionStatus: FORM_STATUS.idle,
    });

    let presentRef = React.createRef();

    function setCompanyInput(value) {
      setCompany({
        ...company,
        companyNameInput: value,
        companyChange: true,
      });
    }

    function validateCompany(value) {
      let newState;

      if (value.trim() === "") {
        newState = {
          ...company,
          companyNameInput: "",
          companyStatus: FORM_STATUS.error,
        };
        setCompany(newState);
        updateExperience(expIndex, newState);
        return;
      }

      if (value === userCompanyName) {
        newState = {
          companyNameInput: value,
          companyChange: false,
          companyStatus: FORM_STATUS.idle,
        };
        setCompany(newState);
        updateExperience(expIndex, newState);
        return;
      }

      if (validateInput("name", value)) {
        newState = {
          ...company,
          companyStatus: FORM_STATUS.success,
        };
      } else {
        newState = {
          ...company,
          companyStatus: FORM_STATUS.error,
        };
      }
      setCompany(newState);
      updateExperience(expIndex, newState);
    }

    function setTitleInput(value) {
      setTitle({
        ...title,
        titleInput: value,
        titleChange: true,
      });
    }

    function validateTitle(value) {
      let newState;

      if (value.trim() === "") {
        newState = {
          ...title,
          titleInput: "",
          titleStatus: FORM_STATUS.error,
        };
        setTitle(newState);
        updateExperience(expIndex, newState);
        return;
      }

      if (value === userJobTitle) {
        newState = {
          titleInput: value,
          titleChange: false,
          titleStatus: FORM_STATUS.idle,
        };
        setTitle(newState);
        updateExperience(expIndex, newState);
        return;
      }

      if (validateInput("title", value)) {
        newState = {
          ...title,
          titleStatus: FORM_STATUS.success,
        };
      } else {
        newState = {
          ...title,
          titleStatus: FORM_STATUS.error,
        };
      }
      setTitle(newState);
      updateExperience(expIndex, newState);
    }

    function setFromMonthDate(value) {
      setDates({
        ...dates,
        fromMonth: value,
        dateChange: true,
      });
    }

    function validateFromMonthDate(value) {
      if (!dates.dateChange && value) return;
      if (value === "") {
        setDates({
          ...dates,
          fromMonthStatus: FORM_STATUS.error,
          fromMonth: value,
        });
      } else {
        setDates({
          ...dates,
          fromMonthStatus: FORM_STATUS.success,
          fromMonth: value,
        });
      }
      updateExperience(expIndex, {
        dateChange: true,
        fromMonth: value,
      });
    }

    function setFromYearDate(value) {
      setDates({
        ...dates,
        fromYear: value,
        dateChange: true,
      });
    }

    function validateFromYearDate(value) {
      if (!dates.dateChange && value) return;
      if (value === "") {
        setDates({
          ...dates,
          fromYearStatus: FORM_STATUS.error,
          fromYear: value,
        });
      } else {
        setDates({
          ...dates,
          fromYearStatus: FORM_STATUS.success,
          fromYear: value,
        });
      }
      updateExperience(expIndex, {
        dateChange: true,
        fromYear: value,
      });
    }

    function setToMonthDate(value) {
      setDates({
        ...dates,
        toMonth: value,
        dateChange: true,
      });
    }

    function validateToMonthDate(value) {
      if (!dates.dateChange && value) return;
      if (value === "") {
        setDates({
          ...dates,
          toMonthStatus: FORM_STATUS.error,
          toMonth: value,
        });
      } else {
        setDates({
          ...dates,
          toMonthStatus: FORM_STATUS.success,
          toMonth: value,
        });
      }
      updateExperience(expIndex, {
        dateChange: true,
        toMonth: value,
      });
    }

    function setToYearDate(value) {
      setDates({
        ...dates,
        toYear: value,
        dateChange: true,
      });
    }

    function validateToYearDate(value) {
      if (!dates.dateChange && value) return;
      if (value === "") {
        setDates({
          ...dates,
          toYearStatus: FORM_STATUS.error,
          toYear: value,
        });
      } else {
        setDates({
          ...dates,
          toYearStatus: FORM_STATUS.success,
          toYear: value,
        });
      }
      updateExperience(expIndex, {
        dateChange: true,
        toYear: value,
      });
    }

    function setToPresentDate() {
      if (presentRef.current.checked) {
        updateExperience(expIndex, {
          dateChange: true,
          toPresent: "Present",
        });
      } else {
        updateExperience(expIndex, {
          dateChange: true,
          toPresent: "",
        });
      }
      setDates({
        ...dates,
        dateChange: true,
      });
    }

    function setDescriptionInput(value) {
      setDescription({
        ...description,
        descriptionInput: value,
        descriptionChange: true,
      });
    }

    function validateDescription(value) {
      let newState;

      if (value.trim() === "") {
        newState = {
          ...description,
          descriptionInput: "",
          descriptionStatus: FORM_STATUS.error,
        };
        setDescription(newState);
        updateExperience(expIndex, newState);
        return;
      }

      if (value === userDescription) {
        newState = {
          descriptionInput: value,
          descriptionChange: false,
          descriptionStatus: FORM_STATUS.idle,
        };
        setDescription(newState);
        updateExperience(expIndex, newState);
        return;
      }

      if (validateInput("summary", value)) {
        newState = {
          ...description,
          descriptionStatus: FORM_STATUS.success,
        };
      } else {
        newState = {
          ...description,
          descriptionStatus: FORM_STATUS.error,
        };
      }
      setDescription(newState);
      updateExperience(expIndex, newState);
    }

    return (
      <Fieldset>
        <legend>Experience: {company.companyNameInput || "New Company"}</legend>

        <button
          ref={removeBtnRef}
          type="button"
          aria-label={`Remove ${company.companyNameInput || "New"} Company`}
          onClick={() => removeExperience(expIndex)}
        >
          X
        </button>

        <InputContainer>
          <label htmlFor={`company-${userId}`}>Company:</label>
          <input
            type="text"
            autoComplete="organization"
            id={`company-${userId}`}
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

        <InputContainer>
          <label htmlFor={`title-${userId}`}>Title:</label>
          <input
            type="text"
            autoComplete="organization-title"
            id={`title-${userId}`}
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

        <div>
          <InputContainer>
            <label htmlFor={`from-month-${userId}`}>From Month:</label>
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
        </div>

        {userToPresent !== "Present" ? (
          <div>
            <InputContainer>
              <label htmlFor={`to-month-${userId}`}>To Month:</label>
              <select
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
                <span
                  id={`to-month-${userId}-success`}
                  className="success-mssg"
                >
                  month is Validated
                </span>
              ) : null}
            </InputContainer>

            <InputContainer>
              <label htmlFor={`to-year-${userId}`}>To Year:</label>
              <select
                name="to-year"
                id={`to-year-${userId}`}
                defaultValue={userToYear}
                className={`input ${
                  dates.toYearStatus === FORM_STATUS.error ? "input-err" : ""
                }`}
                aria-describedby={`to-year-${userId}-error to-year-${userId}-success`}
                aria-invalid={
                  dates.toYear === "" ||
                  dates.toYearStatus === FORM_STATUS.error
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
          </div>
        ) : null}

        <input
          ref={presentRef}
          type="checkbox"
          id={`to-present-${userId}`}
          name="to-present"
          onChange={setToPresentDate}
          checked={userToPresent === "Present"}
        />
        <label htmlFor={`present-${userId}`}>Present</label>

        <InputContainer>
          <label htmlFor={`description-${userId}`}>Description:</label>
          <input
            type="text"
            id={`description-${userId}`}
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

export default ExperienceForm;
