import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import EducationForm from "../../../components/forms/user-extras/EducationForm";

/*

2 types of validation

ON BLUR
regex validation
toggle validation for input

ON SUBMIT
required inputs validation
regex validation on all

These will also be *required


*/

function DashboardEducation() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const [editInputs, setEditInputs] = useState(false);
  const [education, setEducation] = useState([]);
  const [educationChange, setEducationChange] = useState(false);
  const [idTracker, setIdTracker] = useState(1);

  function onEditInputs() {
    setEditInputs(true);

    setEducation(user.education);
  }

  function onEducationChange(index, state) {
    if (!educationChange) {
      setEducationChange(true);
    }
    let newEduArr = [...education];
    let newEduObj = { ...newEduArr[index], ...state };
    newEduArr.splice(index, 1, newEduObj);
    setEducation(newEduArr);
  }

  function addEducation() {
    if (!educationChange) {
      setEducationChange(true);
    }
    setEducation([
      ...education,
      {
        id: `f-${idTracker}`,
        school: "",
        school_dates: "",
        field_of_study: "",
        education_description: "",
      },
    ]);
    setIdTracker(idTracker + 1);
  }

  function removeEducation(id) {
    if (!educationChange) {
      setEducationChange(true);
    }
    let newEducation = education.filter((edu) => edu.id !== id);
    setEducation(newEducation);
  }

  function submitEdit() {
    if (!educationChange) {
      return;
    }

    let requests = [];
    let checkEdu = {};

    for (let i = 0; i < education.length; i++) {
      checkEdu[education[i].id] = true;
    }

    for (let i = 0; i < user.education.length; i++) {
      if (!(user.education[i].id in checkEdu)) {
        requests.push({
          method: "DELETE",
          url: `/extras/education/${user.education[i].id}`,
        });
      }
    }

    for (let i = 0; i < education.length; i++) {
      if (education[i].id[0] === "f") {
        requests.push({
          method: "POST",
          url: `/extras/new/education`,
          data: {
            school: education[i].school,
            school_dates: education[i].school_dates,
            field_of_study: education[i].field_of_study,
            education_description: education[i].education_description,
            user_id: user.id,
          },
        });
      }
      if (education[i].id[0] !== "f" && education[i].shouldEdit) {
        requests.push({
          method: "PUT",
          url: `/extras/education/${education[i].id}`,
          data: {
            school: education[i].school,
            school_dates: education[i].school_dates,
            field_of_study: education[i].field_of_study,
            education_description: education[i].education_description,
          },
        });
      }
    }

    if (requests.length === 0) {
      return;
    }
    setEditInputs(false);
    addUserExtras(requests);
  }

  if (!editInputs) {
    return (
      <div>
        <h1>Edit Inputs</h1>
        <button onClick={onEditInputs}>Edit</button>
      </div>
    );
  }

  console.log("===EDU DASH===", education);

  return (
    <Main>
      <h1>Hello Education</h1>
      <button onClick={addEducation}>Add New Location</button>
      <br />
      <br />
      {education.map((edu, index) => {
        return (
          <div key={index}>
            <EducationForm
              eduIndex={index}
              userId={edu.id}
              userSchool={edu.school}
              userFieldOfStudy={edu.field_of_study}
              userFromDate={edu.school_dates.split(" - ")[0] || ""}
              userToDate={edu.school_dates.split(" - ")[1] || ""}
              userDescription={edu.education_description}
              onEducationChange={onEducationChange}
              removeEducation={removeEducation}
            />
            <br />
            <br />
          </div>
        );
      })}
      <button onClick={submitEdit}>Submit</button>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardEducation;
