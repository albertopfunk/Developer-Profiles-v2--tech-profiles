import React, { useState } from "react";
import { useEffect } from "react";
import { dateFormat } from "../../../global/helpers/date-format";

function EducationForm({
  userId,
  userSchool,
  userFieldOfStudy,
  userFromDate,
  userToDate,
  userDescription,
  onEducationChange,
  eduIndex,
  removeEducation,
}) {
  const [id, SetId] = useState("");
  const [school, setSchool] = useState("");
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
    SetId(userId);
    setSchool(userSchool);
    setFieldOfStudy(userFieldOfStudy);
    setDescription(userDescription);
  }, [userId, userSchool, userFieldOfStudy, userDescription]);

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

  function updateEducation(value) {
    onEducationChange(eduIndex, {
      shouldEdit: true,
      ...value,
    });
  }

  function onSchoolChange(value) {
    updateEducation({ school: value });
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
    removeEducation(id);
  }

  console.log("===EDU FORM===", school, fromDate, toDate, userToDate);
  return (
    <form>
      <button onClick={(e) => onRemoveEducation(e)}>Remove</button>
      <input
        type="text"
        placeholder="School"
        value={school}
        onChange={(e) => onSchoolChange(e.target.value)}
      />
      <br />
      <input
        type="text"
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
        placeholder="description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
    </form>
  );
}

export default EducationForm;
