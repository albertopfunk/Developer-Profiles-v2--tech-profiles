import React, { useContext, useState } from "react";
import { useEffect } from "react";

function EducationForm(props) {
  const [id, SetId] = useState("");
  const [school, setSchool] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [dates, setDates] = useState("");
  const [carotRange, seCarotRange] = useState(0);
  const [description, setDescription] = useState("");

  let dateRef = React.createRef();

  useEffect(() => {
    SetId(props.id);
    setSchool(props.school);
    setFieldOfStudy(props.fieldOfStudy);
    setDates(props.dates);
    setDescription(props.description);
    dateRef.current.setSelectionRange(carotRange, carotRange);
  });

  function updateEducation(value) {
    props.onEducationChange(props.index, {
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

  function onDatesChange(value) {
    if (value === "") {
      updateEducation({ school_dates: "" });
      return;
    }

    let newValue = "";
    let newCarotRange = 0;
    let i = 0;
    if (value.length < dates.length) {
      i++;
    }
    for (i = i; i <= value.length; i++) {
      if (value[i] !== dates[i]) {
        newCarotRange = i + 1;
        break;
      }
    }

    for (let i = 0; i < value.length; i++) {
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
        newCarotRange++;
      }
    }

    if (newValue.length > 1) {
      if (newValue[0] === "0" && newValue[1] === "0") {
        updateEducation({ school_dates: "0" });
        return;
      }

      if (newValue[0] + newValue[1] > 12) {
        newValue = "0" + newValue;
        newCarotRange++;
      }
    }

    if (newValue.length > 1) {
      newValue = `${newValue[0] || ""}${newValue[1] || ""} / ${newValue[2] ||
        ""}${newValue[3] || ""}`;
    }

    if (newCarotRange === 2) {
      newCarotRange += 3;
    }

    seCarotRange(newCarotRange);
    updateEducation({ school_dates: newValue });
  }

  function onDescriptionChange(value) {
    updateEducation({ education_description: value });
  }

  function removeEducation(e) {
    e.preventDefault();
    props.removeEducation(id);
  }

  console.log("===EDU FORM===", school, fieldOfStudy);
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
