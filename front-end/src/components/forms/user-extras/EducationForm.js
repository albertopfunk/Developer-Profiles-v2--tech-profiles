import React, { useContext, useState } from "react";
import { useEffect } from "react";
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

  const {user} = useContext(ProfileContext)
  const [id, SetId] = useState(userId);
  // properties need to match parent
  const [school, setSchool] = useState({
    inputValue: userSchool,
    inputChange: false,
    inputStatus: FORM_STATUS.idle
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
    // there will never be null values
    let newState;
    if (value === user.education[eduIndex].school) {
      newState = {
        inputChange: false,
        inputValue: value,
        inputStatus: "idle",
      };
    } else {
      newState = {
        ...school,
        inputChange: true,
        inputValue: value,
      };
    }

    setSchool(newState);
    // properties need to match parent
    updateEducation(eduIndex, newState);
  }

  function validateSchool(value) {
    // this component will update local state and send inputValue and inputStatus to parent

    // validate will also check if value is empty
    // since all are required
    // might put noValidate on form or not put required on inputs so
    // you can handle all validation
    // arai-invalid will start off as true

    let newState;
    if (!school.inputChange) return;
    if (value.trim() === "") {
      newState = {
        ...school,
        inputValue: "",
        inputStatus: "error",
      };
    } else if (validateInput("name", value)) {
      newState = {
        ...school,
        inputStatus: "success",
      };
    } else {
      newState = {
        ...school,
        inputStatus: "error",
      };
    }
    setSchool(newState);
    // properties need to match parent
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
      <legend>Education: {school.inputValue || "New Education"}</legend>

      <button onClick={(e) => onRemoveEducation(e)}>Remove</button>
      <input
        id={`school-${userId}`}
        name={`school-${userId}`}
        type="text"
        placeholder="School"
        value={school.inputValue}
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
