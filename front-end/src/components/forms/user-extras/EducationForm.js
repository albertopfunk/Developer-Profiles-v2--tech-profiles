import React, { useContext, useState, useEffect } from "react";

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

  function setSchoolInput(value) {
    let newState;
    if (
      user.education.length > 0 &&
      value === user.education[eduIndex].school
    ) {
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
    // might put noValidate on form or not put required on inputs so
    // you can handle all validation
    // arai-invalid will start off as true
    // might have to start all statuses as FORM_STATUS.error

    let newState;
    if (!school.schoolChange) return;
    if (value.trim() === "") {
      newState = {
        ...school,
        school: "",
        schoolStatus: FORM_STATUS.error,
      };
    } else if (validateInput("name", value)) {
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
    let newState;
    if (
      user.education.length > 0 &&
      value === user.education[eduIndex].field_of_study
    ) {
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
    if (!fieldOfStudy.fieldOfStudyChange) return;
    if (value.trim() === "") {
      newState = {
        ...fieldOfStudy,
        field_of_study: "",
        fieldOfStudyStatus: FORM_STATUS.error,
      };
    } else if (validateInput("title", value)) {
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

  function setDescriptionInput(value) {
    let newState;
    if (
      user.education.length > 0 &&
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
    if (!description.descriptionChange) return;
    if (value.trim() === "") {
      newState = {
        ...description,
        education_description: "",
        descriptionStatus: FORM_STATUS.error,
      };
    } else if (validateInput("summary", value)) {
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

  console.log("===EDU FORM===");
  return (
    <fieldset>
      <legend>Education: {school.school || "New Education"}</legend>

      <button onClick={() => removeEducation(userId)}>Remove</button>
      <input
        id={`school-${userId}`}
        name={`school-${userId}`}
        type="text"
        placeholder="School"
        value={school.school}
        onChange={(e) => setSchoolInput(e.target.value)}
        onBlur={(e) => validateSchool(e.target.value)}
      />

      <br />

      <input
        type="text"
        id={`field-of-study-${userId}`}
        name={`field-of-study-${userId}`}
        placeholder="Field of Study"
        value={fieldOfStudy.field_of_study}
        onChange={(e) => setFieldOfStudyInput(e.target.value)}
        onBlur={(e) => validateFieldOfStudy(e.target.value)}
      />

      <br />

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

      <br />
      <input
        type="text"
        id={`description-${userId}`}
        name={`description-${userId}`}
        placeholder="description"
        value={description.education_description}
        onChange={(e) => setDescriptionInput(e.target.value)}
        onBlur={(e) => validateDescription(e.target.value)}
      />
    </fieldset>
  );
}

export default EducationForm;
