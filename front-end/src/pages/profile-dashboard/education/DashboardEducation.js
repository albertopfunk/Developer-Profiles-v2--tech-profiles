/*

STATE

education: [{},{},{}]
modified with updateEducation, addEducation, removeEducation-
setFormInputs will modify with original user info + new object props-
each object will signify a education fieldset-
each object will track individual input change/validation-


.
.

setFormInputs()

formStatus = idle

education = original user info + new object props
{
  ...edu,
  schoolStatus: idle,
  schoolChange: false,
  fieldOfStudyStatus: idle,
  fieldOfStudyChange: false,
  descriptionStatus: idle,
  descriptionChange: false,
  schoolDatesStatus: idle,
  schoolDatesChange: false
}


.
.

onInputChange()
state value change will be handled by child
child will send change to parent so parent can update
child will send new input value, along with inputChange status
using updateEducation

.
.


validateOnBlur()
validation will be handled by child
child will send validation status to parent
using updateEducation


.
.

SubmitEdits()

3 APIs

POST /new/:user_extra
one request for each new extra
all inputs will be complete since all are required

PUT /:user_extra/:user_extra_id
one request for each edited existing extra
only send values that have changed

DELETE /:user_extra/:user_extra_id
one request for each extra to remove

.

map thru educations to check all the input statuses
if any are error, then form status will be in error
if any are blank, then form status will be in error

map thru educations to check if any changes on EXISTING only
or any additions or removals
if no on everything then return
if true on changes, set up HTTP request
if true on additions, set up HTTP request
if true on removals, set up HTTP request


if user adds a new edu and submits
need to check for empty fields on submit as well

*/

import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import EducationForm from "../../../components/forms/user-extras/EducationForm";
import { FORM_STATUS } from "../../../global/helpers/variables";

let formSuccessWait;
function DashboardEducation() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [education, setEducation] = useState([]);
  const [idTracker, setIdTracker] = useState(1);

  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);

    const updatedUserEdu = user.education.map((edu) => {
      return {
        ...edu,
        schoolStatus: FORM_STATUS.idle,
        schoolChange: false,
        fieldOfStudyStatus: FORM_STATUS.idle,
        fieldOfStudyChange: false,
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,
        schoolDatesStatus: FORM_STATUS.idle,
        schoolDatesChange: false,
      };
    });

    setEducation(updatedUserEdu);
  }

  function updateEducation(index, state) {
    // updating on change, value can be done in children
    // this should only be for updating state

    // on blur validation can be done in children
    // set input status then send to parent to update state

    // both inputChange and inputValidation can use this fn
    // since all ur doing here is updating state
    // children will send all updated state and status

    // on submit parent can check each input for validation/changes

    let newEduArr = [...education];
    let newEduObj = { ...newEduArr[index], ...state };
    newEduArr.splice(index, 1, newEduObj);
    setEducation(newEduArr);
  }

  function addEducation() {
    // if u only set the newEducation state then you would have to update it as well on every change
    // might be better to just work with education
    // the logic of new/removals can be done on submit

    // new education will be any education that is a string

    setEducation([
      ...education,

      {
        id: `n-${idTracker}`,

        school: "",
        schoolStatus: FORM_STATUS.idle,
        schoolChange: false,

        field_of_study: "",
        fieldOfStudyStatus: FORM_STATUS.idle,
        fieldOfStudyChange: false,

        education_description: "",
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,

        school_dates: "",
        schoolDatesStatus: FORM_STATUS.idle,
        schoolDatesChange: false,
      },
    ]);

    setIdTracker(idTracker + 1);
  }

  function removeEducation(id) {
    // if u only set the newEducation state then you would have to update it as well on every change
    // might be better to just work with education
    // the logic of new/removals can be done on submit

    // education to remove will be any education that is not present in USER educations
    // can compare IDs
    // new educations will not be a part of this

    let newEducation = education.filter((edu) => edu.id !== id);
    setEducation(newEducation);
  }

  async function submitEdit() {
    let requests = [];
    let educationObj = {};

    // check for errors and changes

    // ADD / DELETE
    education.forEach((edu) => {
      if (Number.isInteger(edu.id)) {
        educationObj[edu.id] = true;
      } else {
        requests.push({
          method: "POST",
          url: `/extras/new/education`,
          data: {
            school: edu.school,
            school_dates: edu.school_dates,
            field_of_study: edu.field_of_study,
            education_description: edu.education_description,
            user_id: user.id,
          },
        });
      }
    });

    user.education.forEach((edu) => {
      if (!(edu.id in educationObj)) {
        requests.push({
          method: "DELETE",
          url: `/extras/education/${edu.id}`,
        });
      }
    });

    // UPDATE
    education.forEach((edu) => {
      if (Number.isInteger(edu.id)) {
        if (
          edu.schoolChange ||
          edu.fieldOfStudyChange ||
          edu.descriptionChange ||
          edu.schoolDatesChange
        ) {
          const data = {};
          if (edu.schoolChange) {
            data.school = edu.school;
          }
          if (edu.fieldOfStudyChange) {
            data.field_of_study = edu.field_of_study;
          }
          if (edu.descriptionChange) {
            data.education_description = edu.education_description;
          }
          if (edu.schoolDatesChange) {
            data.school_dates = edu.school_dates;
          }
          requests.push({
            method: "PUT",
            url: `/extras/education/${edu.id}`,
            data,
          });
        }
      }
    });

    if (requests.length === 0) {
      return;
    }

    setFormStatus(FORM_STATUS.loading);
    await addUserExtras(requests);
    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  if (!formStatus) {
    return (
      <div>
        <h1>Edit Inputs</h1>
        <button onClick={setFormInputs}>Edit</button>
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
      <form onSubmit={(e) => submitEdit(e)}>
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
                updateEducation={updateEducation}
                removeEducation={removeEducation}
              />
              <br />
              <br />
            </div>
          );
        })}
        <button>Submit</button>
      </form>
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
