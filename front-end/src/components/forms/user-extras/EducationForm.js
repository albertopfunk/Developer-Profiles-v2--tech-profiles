import React, { useState } from "react";
import { useEffect } from "react";
import { dateFormat } from "../../../global/hooks/profile-dashboard";

function EducationForm({
  userId,
  userSchool,
  userFieldOfStudy,
  userFromDate,
  userToDate,
  userDescription,
  onEducationChange,
  eduIndex,
  removeEducation
}) {
  const [id, SetId] = useState("");
  const [school, setSchool] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromCarotRange, setFromCarotRange] = useState(0);
  const [toCarotRange, setToCarotRange] = useState(0);
  const [description, setDescription] = useState("");

  let fromDateRef = React.createRef();
  let toDateRef = React.createRef();

  useEffect(() => {
    SetId(userId);
    setSchool(userSchool);
    setFieldOfStudy(userFieldOfStudy);
    setDescription(userDescription);
  }, [userId, userSchool, userFieldOfStudy, userDescription]);

  useEffect(() => {
    setFromDate(userFromDate);
    setToDate(userToDate);
    fromDateRef.current.setSelectionRange(fromCarotRange, fromCarotRange);
    toDateRef.current.setSelectionRange(toCarotRange, toCarotRange);
  }, [
    userFromDate,
    userToDate,
    fromDate,
    toDate,
    fromCarotRange,
    toCarotRange,
    fromDateRef,
    toDateRef
  ]);

  function updateEducation(value) {
    onEducationChange(eduIndex, {
      shouldEdit: true,
      ...value
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

  function onDescriptionChange(value) {
    updateEducation({ education_description: value });
  }

  function onRemoveEducation(e) {
    e.preventDefault();
    removeEducation(id);
  }

  console.log("===EDU FORM===");
  return (
    <form>
      <button onClick={e => onRemoveEducation(e)}>Remove</button>
      <input
        type="text"
        placeholder="School"
        value={school}
        onChange={e => onSchoolChange(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChange={e => onFieldOfStudyChange(e.target.value)}
      />
      <br />
      <input
        type="text"
        ref={fromDateRef}
        placeholder="MM/YY"
        value={fromDate}
        onChange={e => fromDateChange(e.target.value)}
      />
      <span> - </span>
      <input
        type="text"
        ref={toDateRef}
        placeholder="MM/YY"
        value={toDate}
        onChange={e => toDateChange(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={e => onDescriptionChange(e.target.value)}
      />
    </form>
  );
}

export default EducationForm;
