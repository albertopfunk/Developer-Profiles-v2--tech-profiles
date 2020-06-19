import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import EducationForm from "../../../components/forms/user-extras/EducationForm";

function DashboardEducation() {
  const { loadingUser, user, addUserExtras } = useContext(ProfileContext);
  const [editInputs, setEditInputs] = useState(false);
  const [education, setEducation] = useState([]);

  function onEditInputs() {
    setEditInputs(true);
    setEducation(user.education);
  }

  function onEducationChange(index, state) {
    let newEduArr = [...education];
    let newEduObj = { ...newEduArr[index], ...state };
    newEduArr.splice(index, 1, newEduObj);
    setEducation(newEduArr);
  }

  function addEducation() {
    setEducation([
      ...education,
      {
        id: false,
        school: "",
        school_dates: "",
        field_of_study: "",
        education_description: ""
      }
    ]);
  }

  function removeEducation(id) {
    let newEducation = education.filter(edu => edu.id !== id);
    setEducation(newEducation);
  }

  function submitEdit() {
    let requests = [];

    let checkEdu = {};
    for (let i = 0; i < education.length; i++) {
      if (education[i].id) {
        checkEdu[education[i].id] = true;
      }
    }

    for (let i = 0; i < user.education.length; i++) {
      if (!(user.education[i].id in checkEdu)) {
        requests.push({
          method: "DELETE",
          url: `/extras/education/${user.education[i].id}`
        });
      }
    }

    for (let i = 0; i < education.length; i++) {
      if (!education[i].id) {
        requests.push({
          method: "POST",
          url: `/extras/new/education`,
          data: {
            school: education[i].school,
            school_dates: education[i].school_dates,
            field_of_study: education[i].field_of_study,
            education_description: education[i].education_description,
            user_id: user.id
          }
        });
      }
      if (education[i].id && education[i].shouldEdit) {
        requests.push({
          method: "PUT",
          url: `/extras/education/${education[i].id}`,
          data: {
            school: education[i].school,
            school_dates: education[i].school_dates,
            field_of_study: education[i].field_of_study,
            education_description: education[i].education_description
          }
        });
      }
    }

    if (requests.length === 0) {
      return;
    }
    setEditInputs(false);
    addUserExtras(requests);
  }

  if (loadingUser) {
    return <h1>Loading...</h1>;
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
              index={index}
              id={edu.id}
              school={edu.school}
              fieldOfStudy={edu.field_of_study}
              dates={edu.school_dates}
              description={edu.education_description}
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
