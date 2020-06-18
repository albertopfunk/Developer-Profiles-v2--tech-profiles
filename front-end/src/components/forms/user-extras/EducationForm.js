import React, { useContext, useState } from "react";
import { useEffect } from "react";

function EducationForm(props) {
  const [hasChanged, setHasChanged] = useState(false);
  const [id, SetId] = useState("");
  const [school, setSchool] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [dates, setDates] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    SetId(props.id);
    setSchool(props.school);
    setFieldOfStudy(props.fieldOfStudy);
    setDates(props.dates);
    setDescription(props.description);
  }, []);

  async function onSchoolChange(value) {
    if (!hasChanged) {
      setHasChanged(true);
    }
    setSchool(value);
    props.onEducationChange(props.index, {
      shouldEdit: true,
      id,
      school: value,
      school_dates: dates,
      field_of_study: fieldOfStudy,
      education_description: description
    });
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
        onChange={e => setFieldOfStudy(e.target.value)}
      />
    </form>
    // save / cancel buttons?
  );
}

export default EducationForm;
