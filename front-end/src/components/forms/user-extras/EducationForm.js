import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";

function EducationForm({
  eduIndex,
  userId,
  userSchool,
  userFieldOfStudy,
  userFromYear,
  userFromMonth,
  userToYear,
  userToMonth,
  userToPresent,
  userDescription,
  updateEducation,
  removeEducation,
}) {
  const { user } = useContext(ProfileContext);

  const [school, setSchool] = useState({
    school: userSchool,
    schoolChange: false,
    schoolStatus: FORM_STATUS.idle,
  });

  const [fieldOfStudy, setFieldOfStudy] = useState({
    field_of_study: userFieldOfStudy,
    fieldOfStudyChange: false,
    fieldOfStudyStatus: FORM_STATUS.idle,
  });

  const [dates, setDates] = useState({
    schoolFromYear: userFromYear,
    schoolFromYearStatus: FORM_STATUS.idle,
    schoolFromMonth: userFromMonth,
    schoolFromMonthStatus: FORM_STATUS.idle,
    schoolToYear: userToYear,
    schoolToYearStatus: FORM_STATUS.idle,
    schoolToMonth: userToMonth,
    schoolToMonthStatus: FORM_STATUS.idle,
    schoolToPresent: userToPresent,
  });

  const [description, setDescription] = useState({
    education_description: userDescription,
    descriptionChange: false,
    descriptionStatus: FORM_STATUS.idle,
  });

  let presentRef = React.createRef();

  function setSchoolInput(value) {
    setSchool({
      ...school,
      school: value,
      schoolChange: true,
    });
  }

  function validateSchool(e) {
    let newState;
    const { value, dataset } = e.target;

    const isUserSchool =
      user.education.length > 0 && !dataset.inputid.includes("new");
    if (isUserSchool && value === user.education[eduIndex].school) {
      setSchool({
        school: value,
        schoolChange: false,
        schoolStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value.trim() === "") {
      newState = {
        ...school,
        school: "",
        schoolStatus: FORM_STATUS.error,
      };
      setSchool(newState);
      updateEducation(eduIndex, newState);
      return;
    }

    if (!school.schoolChange) return;
    if (validateInput("name", value)) {
      newState = {
        ...school,
        schoolStatus: FORM_STATUS.success,
      };
    } else {
      newState = {
        ...school,
        schoolStatus: FORM_STATUS.error,
      };
    }

    setSchool(newState);
    updateEducation(eduIndex, newState);
  }

  function setFieldOfStudyInput(value) {
    setFieldOfStudy({
      ...fieldOfStudy,
      field_of_study: value,
      fieldOfStudyChange: true,
    });
  }

  function validateFieldOfStudy(e) {
    let newState;
    const { value, dataset } = e.target;

    const isUserSchool =
      user.education.length > 0 && !dataset.inputid.includes("new");
    if (isUserSchool && value === user.education[eduIndex].field_of_study) {
      setFieldOfStudy({
        field_of_study: value,
        fieldOfStudyChange: false,
        fieldOfStudyStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value.trim() === "") {
      newState = {
        ...fieldOfStudy,
        field_of_study: "",
        fieldOfStudyStatus: FORM_STATUS.error,
      };
      setFieldOfStudy(newState);
      updateEducation(eduIndex, newState);
      return;
    }

    if (!fieldOfStudy.fieldOfStudyChange) return;
    if (validateInput("title", value)) {
      newState = {
        ...fieldOfStudy,
        fieldOfStudyStatus: FORM_STATUS.success,
      };
    } else {
      newState = {
        ...fieldOfStudy,
        fieldOfStudyStatus: FORM_STATUS.error,
      };
    }

    setFieldOfStudy(newState);
    updateEducation(eduIndex, newState);
  }

  function setFromMonthDate(value) {
    if (value === "") {
      setDates({
        ...dates,
        schoolFromMonthStatus: FORM_STATUS.error,
        schoolFromMonth: value,
      });
    } else {
      setDates({
        ...dates,
        schoolFromMonthStatus: FORM_STATUS.success,
        schoolFromMonth: value,
      });
    }
    updateEducation(eduIndex, {
      schoolFromDateChange: true,
      schoolFromMonth: value,
    });
  }

  function setFromYearDate(value) {
    if (value === "") {
      setDates({
        ...dates,
        schoolFromYearStatus: FORM_STATUS.error,
        schoolFromYear: value,
      });
    } else {
      setDates({
        ...dates,
        schoolFromYearStatus: FORM_STATUS.success,
        schoolFromYear: value,
      });
    }
    updateEducation(eduIndex, {
      schoolFromDateChange: true,
      schoolFromYear: value,
    });
  }

  function setToMonthDate(value) {
    setDates({
      ...dates,
      schoolToMonth: value,
    });
    if (value === "") {
      setDates({
        ...dates,
        schoolToMonthStatus: FORM_STATUS.error,
        schoolToMonth: value,
      });
    } else {
      setDates({
        ...dates,
        schoolToMonthStatus: FORM_STATUS.success,
        schoolToMonth: value,
      });
    }
    updateEducation(eduIndex, {
      schoolToDateChange: true,
      schoolToMonth: value,
    });
  }

  function setToYearDate(value) {
    if (value === "") {
      setDates({
        ...dates,
        schoolToYearStatus: FORM_STATUS.error,
        schoolToYear: value,
      });
    } else {
      setDates({
        ...dates,
        schoolToYearStatus: FORM_STATUS.success,
        schoolToYear: value,
      });
    }
    updateEducation(eduIndex, {
      schoolToDateChange: true,
      schoolToYear: value,
    });
  }

  function setToPresentDate() {
    if (presentRef.current.checked) {
      updateEducation(eduIndex, {
        schoolToDateChange: true,
        schoolToPresent: "Present",
      });
    } else {
      updateEducation(eduIndex, {
        schoolToDateChange: true,
        schoolToPresent: "",
      });
    }
  }

  function setDescriptionInput(value) {
    setDescription({
      ...description,
      education_description: value,
      descriptionChange: true,
    });
  }

  function validateDescription(e) {
    let newState;
    const { value, dataset } = e.target;

    const isUserSchool =
      user.education.length > 0 && !dataset.inputid.includes("new");
    if (
      isUserSchool &&
      value === user.education[eduIndex].education_description
    ) {
      setDescription({
        education_description: value,
        descriptionChange: false,
        descriptionStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value.trim() === "") {
      newState = {
        ...description,
        education_description: "",
        descriptionStatus: FORM_STATUS.error,
      };
      setDescription(newState);
      updateEducation(eduIndex, newState);
      return;
    }

    if (!description.descriptionChange) return;
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
    updateEducation(eduIndex, newState);
  }

  return (
    <fieldset>
      <legend>Education: {school.school || "New Education"}</legend>

      <button
        type="reset"
        aria-label={`Remove ${school.school || "New"} Education`}
        onClick={() => removeEducation(userId)}
      >
        X
      </button>

      <InputContainer>
        <label htmlFor={`school-${userId}`}>School:</label>
        <input
          type="text"
          id={`school-${userId}`}
          data-inputid={userId}
          name="school"
          className={`input ${
            school.schoolStatus === FORM_STATUS.error ? "input-err" : ""
          }`}
          aria-describedby={`school-${userId}-error school-${userId}-success`}
          aria-invalid={
            school.school.trim() === "" ||
            school.schoolStatus === FORM_STATUS.error
          }
          value={school.school}
          onChange={(e) => setSchoolInput(e.target.value)}
          onBlur={(e) => validateSchool(e)}
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

      <InputContainer>
        <label htmlFor={`field-of-study-${userId}`}>Field of Study:</label>
        <input
          type="text"
          id={`field-of-study-${userId}`}
          data-inputid={userId}
          name="field-of-study"
          className={`input ${
            fieldOfStudy.fieldOfStudyStatus === FORM_STATUS.error
              ? "input-err"
              : ""
          }`}
          aria-describedby={`field-of-study-${userId}-error field-of-study-${userId}-success`}
          aria-invalid={
            fieldOfStudy.field_of_study.trim() === "" ||
            fieldOfStudy.fieldOfStudyStatus === FORM_STATUS.error
          }
          value={fieldOfStudy.field_of_study}
          onChange={(e) => setFieldOfStudyInput(e.target.value)}
          onBlur={(e) => validateFieldOfStudy(e)}
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

      <label htmlFor={`from-month-${userId}`}>From Month:</label>
      <select
        name="from-month"
        id={`from-month-${userId}`}
        defaultValue={userFromMonth}
        onChange={(e) => setFromMonthDate(e.target.value)}
        onBlur={(e) => setFromMonthDate(e.target.value)}
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
      <br />
      <label htmlFor={`from-year-${userId}`}>From Year:</label>
      <select
        name="from-year"
        id={`from-year-${userId}`}
        defaultValue={userFromYear}
        onChange={(e) => setFromYearDate(e.target.value)}
        onBlur={(e) => setFromYearDate(e.target.value)}
      >
        <option value="">--Select Year--</option>
        {Array.from(Array(50)).map((_, i) => (
          <option key={`${i}-${userId}`} value={2020 - i}>
            {2020 - i}
          </option>
        ))}
      </select>

      {userToPresent !== "Present" ? (
        <>
          <label htmlFor={`#to-month-${userId}`}>To Month:</label>
          <select
            name="to-month"
            id={`to-month-${userId}`}
            defaultValue={userToMonth}
            onChange={(e) => setToMonthDate(e.target.value)}
            onBlur={(e) => setToMonthDate(e.target.value)}
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
          <br />
          <label htmlFor={`to-year-${userId}`}>To Year:</label>
          <select
            name="to-year"
            id={`to-year-${userId}`}
            defaultValue={userToYear}
            onChange={(e) => setToYearDate(e.target.value)}
            onBlur={(e) => setToYearDate(e.target.value)}
          >
            <option value="">--Select Year--</option>
            {Array.from(Array(50)).map((_, i) => (
              <option key={`${i}-${userId}`} value={2020 - i}>
                {2020 - i}
              </option>
            ))}
          </select>
        </>
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
          data-inputid={userId}
          name="description"
          className={`input ${
            description.descriptionStatus === FORM_STATUS.error
              ? "input-err"
              : ""
          }`}
          aria-describedby={`description-${userId}-error description-${userId}-success`}
          aria-invalid={
            description.education_description.trim() === "" ||
            description.descriptionStatus === FORM_STATUS.error
          }
          value={description.education_description}
          onChange={(e) => setDescriptionInput(e.target.value)}
          onBlur={(e) => validateDescription(e)}
        />
        {description.descriptionStatus === FORM_STATUS.error ? (
          <span id={`description-${userId}-error`} className="err-mssg">
            Input is required. description can only be alphabelical characters,
            no numbers
          </span>
        ) : null}
        {description.descriptionStatus === FORM_STATUS.success ? (
          <span id={`description-${userId}-success`} className="success-mssg">
            description is Validated
          </span>
        ) : null}
      </InputContainer>
    </fieldset>
  );
}

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

export default EducationForm;
