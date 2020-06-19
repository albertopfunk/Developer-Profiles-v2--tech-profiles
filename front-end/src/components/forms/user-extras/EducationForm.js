import React, { useContext, useState } from "react";
import { useEffect } from "react";

function EducationForm(props) {
  const [id, SetId] = useState("");
  const [school, setSchool] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [dates, setDates] = useState("");
  const [description, setDescription] = useState("");

  let dateRef = React.createRef();

  useEffect(() => {
    SetId(props.id);
    setSchool(props.school);
    setFieldOfStudy(props.fieldOfStudy);
    setDates(props.dates);
    setDescription(props.description);
  }, []);

  function updateEducation(value) {
    props.onEducationChange(props.index, {
      shouldEdit: true,
      ...value
    });
  }

  function onSchoolChange(value) {
    setSchool(value);
    updateEducation({ school: value });
  }

  function onFieldOfStudyChange(value) {
    setFieldOfStudy(value);
    updateEducation({ field_of_study: value });
  }

  function onDatesChange(value) {
    if (value === "") {
      setDates("");
      return;
    }

    let newValue = "";
    let carotRange = 0;
    let keepChecking = true;
    
    for (let i = 0; i < value.length; i++) {
      console.log(value[i], "==", dates[i])
      if (value[i] !== dates[i] && keepChecking) {
        console.log("NO MATCH", i)
        keepChecking = false
        carotRange = i + 1
      }
      if (value[i].match(/^[0-9]$/)) {
        newValue += value[i];
      }
    }

    if (!newValue) {
      return;
    }

    if (newValue.length > 0) {
      if (newValue[0] > 1) {
        newValue = "0" + newValue;
      }
    }

    if (newValue.length > 1) {
      if (newValue[0] + newValue[1] > 12) {
        newValue = "0" + newValue;
      }
    }

    if (newValue.length > 1) {
      newValue = `${newValue[0] || ""}${newValue[1] || ""} / ${newValue[2] ||
        ""}${newValue[3] || ""}`;
    }

    
    setDates(newValue, dateRef.current.setSelectionRange(carotRange, carotRange))
    updateEducation({ school_dates: newValue });
  }

  function onDescriptionChange(value) {
    setDescription(value);
    updateEducation({ education_description: value });
  }

  function removeEducation(e) {
    e.preventDefault();
    props.removeEducation(id);
  }

  return (
    <form>
      <button onClick={e => removeEducation(e)}>Remove</button>
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
        ref={dateRef}
        placeholder="mm/yy"
        value={dates}
        onChange={e => onDatesChange(e.target.value)}
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
