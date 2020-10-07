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
  const [id, SetId] = useState(userId);

  const [school, setSchool] = useState({
    school: userSchool,
    schoolChange: false,
    schoolStatus: FORM_STATUS.idle,
  });

  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [fromCarotRange, setFromCarotRange] = useState(0);
  const [toCarotRange, setToCarotRange] = useState(0);
  const [description, setDescription] = useState("");

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
    if (value === user.education[eduIndex].school) {
      newState = {
        schoolChange: false,
        school: value,
        schoolStatus: FORM_STATUS.idle,
      };
    } else {
      newState = {
        ...school,
        schoolChange: true,
        school: value,
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

  function onFieldOfStudyChange(value) {
    updateEducation({ field_of_study: value });
  }

  function fromDateChange(value) {
    const [newValue, newCarotRange] = dateFormat(value, fromDate);
    if (newValue === false) {
      return;
    }
    setFromCarotRange(newCarotRange);
    updateEducation({ school_dates: `${newValue} - ${userToDate}` });
  }

  function toDateChange(value) {
    const [newValue, newCarotRange] = dateFormat(value, toDate);
    if (newValue === false) {
      return;
    }
    setToCarotRange(newCarotRange);
    updateEducation({ school_dates: `${userFromDate} - ${newValue}` });
  }

  function presentChange() {
    if (presentRef.current.checked) {
      setIsPresent(true);
      updateEducation({ school_dates: `${userFromDate} - present` });
    } else {
      setIsPresent(false);
      updateEducation({ school_dates: `${userFromDate}` });
    }
  }

  function onDescriptionChange(value) {
    updateEducation({ education_description: value });
  }

  function onRemoveEducation(e) {
    e.preventDefault();
    // use "disabled" on fieldset vs removing it completely
    // this will allow users to reverse decision without having to cancel form
    removeEducation(id);
  }

  console.log("===EDU FORM===");
  return (
    <fieldset>
      <legend>Education: {school.school || "New Education"}</legend>

      <button onClick={(e) => onRemoveEducation(e)}>Remove</button>
      <input
        id={`school-${userId}`}
        name={`school-${userId}`}
        type="text"
        placeholder="School"
        value={school.school}
        onChange={(e) => setSchoolInput(e.target.value)}
        onBlur={(e) => validateSchool(e)}
      />
      <br />
      <input
        type="text"
        id={`field-of-study-${userId}`}
        name={`field-of-study-${userId}`}
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChange={(e) => onFieldOfStudyChange(e.target.value)}
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
        id={`present-${id}`}
        name={`present-${id}`}
        onChange={presentChange}
        checked={isPresent}
      />
      <label htmlFor={`present-${id}`}>Present</label>

      <br />
      <input
        type="text"
        id={`description-${userId}`}
        name={`description-${userId}`}
        placeholder="description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
    </fieldset>
  );
}

export default EducationForm;
