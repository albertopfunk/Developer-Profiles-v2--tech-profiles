import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { dateFormat } from "../../../global/helpers/date-format";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";

function EducationForm({
  eduIndex,
  userId,
  userSchool,
  userFieldOfStudy,
  userFromDate,
  userToDate,
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

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [fromCarotRange, setFromCarotRange] = useState(0);
  const [toCarotRange, setToCarotRange] = useState(0);

  const [description, setDescription] = useState({
    education_description: userDescription,
    descriptionChange: false,
    descriptionStatus: FORM_STATUS.idle,
  });

  let fromDateRef = React.createRef();
  let toDateRef = React.createRef();
  let presentRef = React.createRef();

  useEffect(() => {
    if (userToDate === "present") {
      setIsPresent(true);
    }
    if (!isPresent) {
      toDateRef.current.setSelectionRange(toCarotRange, toCarotRange);
    }
    setFromDate(userFromDate);
    setToDate(userToDate);
    fromDateRef.current.setSelectionRange(fromCarotRange, fromCarotRange);
  }, [
    userToDate,
    isPresent,
    userFromDate,
    fromDateRef,
    fromCarotRange,
    toDateRef,
    toCarotRange,
  ]);

  function setSchoolInput(e) {
    const { value, dataset } = e.target;
    const isUserSchool =
      user.education.length > 0 && !dataset.inputid.includes("new");
    let newState;
    if (isUserSchool && value === user.education[eduIndex].school) {
      newState = {
        school: value,
        schoolChange: false,
        schoolStatus: FORM_STATUS.idle,
      };
    } else {
      newState = {
        ...school,
        school: value,
        schoolChange: true,
      };
    }
    setSchool(newState);
    updateEducation(eduIndex, newState);
  }

  function validateSchool(value) {
    let newState;
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

  function setFieldOfStudyInput(e) {
    const { value, dataset } = e.target;
    const isUserSchool =
      user.education.length > 0 && !dataset.inputid.includes("new");
    let newState;
    if (isUserSchool && value === user.education[eduIndex].field_of_study) {
      newState = {
        field_of_study: value,
        fieldOfStudyChange: false,
        fieldOfStudyStatus: FORM_STATUS.idle,
      };
    } else {
      newState = {
        ...fieldOfStudy,
        field_of_study: value,
        fieldOfStudyChange: true,
      };
    }

    setFieldOfStudy(newState);
    updateEducation(eduIndex, newState);
  }

  function validateFieldOfStudy(value) {
    let newState;
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

  function fromDateChange(value) {
    const [newValue, newCarotRange] = dateFormat(value, fromDate);
    if (newValue === false) {
      return;
    }
    setFromCarotRange(newCarotRange);
    updateEducation(eduIndex, { school_dates: `${newValue} - ${userToDate}` });
  }

  function toDateChange(value) {
    const [newValue, newCarotRange] = dateFormat(value, toDate);
    if (newValue === false) {
      return;
    }
    setToCarotRange(newCarotRange);
    updateEducation(eduIndex, {
      school_dates: `${userFromDate} - ${newValue}`,
    });
  }

  function presentChange() {
    if (presentRef.current.checked) {
      setIsPresent(true);
      updateEducation(eduIndex, { school_dates: `${userFromDate} - present` });
    } else {
      setIsPresent(false);
      updateEducation(eduIndex, { school_dates: `${userFromDate}` });
    }
  }

  function setDescriptionInput(e) {
    const { value, dataset } = e.target;
    const isUserSchool =
      user.education.length > 0 && !dataset.inputid.includes("new");
    let newState;
    if (
      isUserSchool &&
      value === user.education[eduIndex].education_description
    ) {
      newState = {
        education_description: value,
        descriptionChange: false,
        descriptionStatus: FORM_STATUS.idle,
      };
    } else {
      newState = {
        ...description,
        education_description: value,
        descriptionChange: true,
      };
    }

    setDescription(newState);
    updateEducation(eduIndex, newState);
  }

  function validateDescription(value) {
    let newState;
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
          onChange={(e) => setSchoolInput(e)}
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
          onChange={(e) => setFieldOfStudyInput(e)}
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

      <input
        type="text"
        ref={fromDateRef}
        placeholder="MM/YY"
        value={fromDate}
        onChange={(e) => fromDateChange(e.target.value)}
      />
      <span> - </span>

      {!isPresent ? (
        <input
          type="text"
          ref={toDateRef}
          placeholder="MM/YY"
          value={toDate}
          onChange={(e) => toDateChange(e.target.value)}
        />
      ) : null}

      <input
        ref={presentRef}
        type="checkbox"
        id={`present-${userId}`}
        name={`present-${userId}`}
        onChange={presentChange}
        checked={isPresent}
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
          onChange={(e) => setDescriptionInput(e)}
          onBlur={(e) => validateDescription(e.target.value)}
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
