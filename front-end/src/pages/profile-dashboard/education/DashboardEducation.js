/*

SubmitEdits()

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
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function DashboardEducation() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [education, setEducation] = useState([]);
  const [idTracker, setIdTracker] = useState(1);

  let errorSummaryRef = React.createRef();

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
    // eslint-disable-next-line
  }, [formStatus]);

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
    let newEduArr = [...education];
    let newEduObj = { ...newEduArr[index], ...state };
    newEduArr.splice(index, 1, newEduObj);
    setEducation(newEduArr);
  }

  function addEducation() {
    setEducation([
      ...education,

      {
        id: `new-${idTracker}`,

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
    let newEducation = education.filter((edu) => edu.id !== id);
    setEducation(newEducation);
  }

  async function submitEdit(e) {
    e.preventDefault();

    let requests = [];
    let educationObj = {};

    // check for errors and changes

    const formErrors = education.filter(
      (edu) =>
        edu.school.trim() === "" ||
        edu.schoolStatus === FORM_STATUS.error ||
        edu.field_of_study.trim() === "" ||
        edu.fieldOfStudyStatus === FORM_STATUS.error ||
        edu.education_description.trim() === "" ||
        edu.descriptionStatus === FORM_STATUS.error ||
        edu.school_dates.trim() === "" ||
        edu.school_dates.split(" - ").length < 2
    );

    if (formErrors.length > 0) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

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

  if (formStatus === FORM_STATUS.idle) {
    return (
      <div>
        <h1>Edit Inputs</h1>
        <button onClick={setFormInputs}>Edit</button>
      </div>
    );
  }

  let formErrors;
  if (formStatus === FORM_STATUS.error) {
    formErrors = education.filter(
      (edu) =>
        edu.school.trim() === "" ||
        edu.schoolStatus === FORM_STATUS.error ||
        edu.field_of_study.trim() === "" ||
        edu.fieldOfStudyStatus === FORM_STATUS.error ||
        edu.education_description.trim() === "" ||
        edu.descriptionStatus === FORM_STATUS.error ||
        edu.school_dates.trim() === "" ||
        edu.school_dates.split(" - ").length < 2
    );
  }

  console.log("-- Dash Education --", education);

  return (
    <Main>
      <h1>Hello Education</h1>
      <button onClick={addEducation}>Add New Location</button>
      <br />

      {formStatus === FORM_STATUS.error ? (
        <div ref={errorSummaryRef} tabIndex="-1">
          <h3 id="error-heading">Errors in Submission</h3>
          <>
            <strong>
              Please address the following errors and re-submit the form:
            </strong>

            {formErrors.length > 0 ? (
              formErrors.map((edu) => (
                <ul aria-label={`current ${edu.school} errors`}>
                  {edu.school.trim() === "" ||
                  edu.schoolStatus === FORM_STATUS.error ? (
                    <li>
                      <a href={`#school-${edu.id}`}>School Error</a>
                    </li>
                  ) : null}

                  {edu.field_of_study.trim() === "" ||
                  edu.fieldOfStudyStatus === FORM_STATUS.error ? (
                    <li>
                      <a href={`#field-of-study-${edu.id}`}>
                        Field of Study Error
                      </a>
                    </li>
                  ) : null}

                  {edu.education_description.trim() === "" ||
                  edu.descriptionStatus === FORM_STATUS.error ? (
                    <li>
                      <a href={`#description-${edu.id}`}>Description Error</a>
                    </li>
                  ) : null}
                </ul>
              ))
            ) : (
              <>
                <p>No Errors, ready to submit</p>
                <Announcer
                  announcement="No Errors, ready to submit"
                  ariaId="no-errors-announcer"
                  ariaLive="polite"
                />
              </>
            )}
          </>
        </div>
      ) : null}

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
        <button
          disabled={
            formStatus === FORM_STATUS.loading ||
            formStatus === FORM_STATUS.success
          }
          type="submit"
        >
          {formStatus === FORM_STATUS.active ? "Submit" : null}
          {formStatus === FORM_STATUS.loading ? "loading..." : null}
          {formStatus === FORM_STATUS.success ? "Success!" : null}
          {formStatus === FORM_STATUS.error ? "Re-Submit" : null}
        </button>
        <button
          disabled={
            formStatus === FORM_STATUS.loading ||
            formStatus === FORM_STATUS.success
          }
          type="reset"
          onClick={() => setFormStatus(FORM_STATUS.idle)}
        >
          Cancel
        </button>
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
