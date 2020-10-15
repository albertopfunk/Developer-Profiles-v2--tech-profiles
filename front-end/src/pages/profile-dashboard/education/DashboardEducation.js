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
  const [educationChange, setEducationChange] = useState(false);
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

    const updatedUserEducation = user.education.map((edu) => {
      const schoolDatesArr = edu.school_dates.split(" - ");
      const schoolFromDate = schoolDatesArr[0];
      const schoolToDate = schoolDatesArr[1];
      const schoolFromMonth = schoolFromDate.split(" ")[0];
      const schoolFromYear = schoolFromDate.split(" ")[1];

      let schoolToMonth;
      let schoolToYear;
      let schoolToPresent;
      if (schoolToDate === "Present") {
        schoolToPresent = "Present";
        schoolToMonth = "";
        schoolToYear = "";
      } else {
        schoolToPresent = "";
        schoolToMonth = schoolToDate.split(" ")[0];
        schoolToYear = schoolToDate.split(" ")[1];
      }

      return {
        ...edu,
        schoolStatus: FORM_STATUS.idle,
        schoolChange: false,
        fieldOfStudyStatus: FORM_STATUS.idle,
        fieldOfStudyChange: false,
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,
        schoolFromMonth,
        schoolFromYear,
        schoolFromDateChange: false,
        schoolToMonth,
        schoolToYear,
        schoolToPresent,
        schoolToDateChange: false,
      };
    });

    setEducation(updatedUserEducation);
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

        schoolFromMonth: "",
        schoolFromYear: "",
        schoolFromDateChange: false,
        schoolToMonth: "",
        schoolToYear: "",
        schoolToPresent: "",
        schoolToDateChange: false,
      },
    ]);

    setIdTracker(idTracker + 1);
    setEducationChange(true);
  }

  function removeEducation(id) {
    let newEducation = education.filter((edu) => edu.id !== id);
    setEducation(newEducation);
    setEducationChange(true);
  }

  function checkFormErrors() {
    return education.filter((edu) => {
      let isErrors = false;
      if (
        edu.school.trim() === "" ||
        edu.schoolStatus === FORM_STATUS.error ||
        edu.field_of_study.trim() === "" ||
        edu.fieldOfStudyStatus === FORM_STATUS.error ||
        edu.education_description.trim() === "" ||
        edu.descriptionStatus === FORM_STATUS.error ||
        edu.schoolFromMonth === "" ||
        edu.schoolFromYear === ""
      ) {
        isErrors = true;
      }

      if (
        edu.schoolToPresent === "" &&
        (edu.schoolToMonth === "" || edu.schoolToYear === "")
      ) {
        isErrors = true;
      }

      return isErrors;
    });
  }

  function addNewEducation() {
    const requests = [];

    education.forEach((edu) => {
      if (!Number.isInteger(edu.id)) {
        const fromDates = `${edu.schoolFromMonth} ${edu.schoolFromYear}`;
        const toDates = edu.schoolToPresent
          ? "Present"
          : `${edu.schoolToMonth} ${edu.schoolToYear}`;
        const school_dates = `${fromDates} - ${toDates}`;
        requests.push({
          method: "POST",
          url: `/extras/new/education`,
          data: {
            school: edu.school,
            school_dates,
            field_of_study: edu.field_of_study,
            education_description: edu.education_description,
            user_id: user.id,
          },
        });
      }
    });

    return requests;
  }

  function removeUserEducation() {
    const requests = [];
    const educationObj = {};

    education.forEach((edu) => {
      if (Number.isInteger(edu.id)) {
        educationObj[edu.id] = true;
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

    return requests;
  }

  function updateUserEducation() {
    const requests = [];

    education.forEach((edu) => {
      if (Number.isInteger(edu.id)) {
        if (
          edu.schoolChange ||
          edu.fieldOfStudyChange ||
          edu.descriptionChange ||
          edu.schoolFromDateChange ||
          edu.schoolToDateChange
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
          if (edu.schoolToDateChange || edu.schoolFromDateChange) {
            const fromDates = `${edu.schoolFromMonth} ${edu.schoolFromYear}`;
            const toDates = edu.schoolToPresent
              ? "Present"
              : `${edu.schoolToMonth} ${edu.schoolToYear}`;
            data.school_dates = `${fromDates} - ${toDates}`;
          }
          requests.push({
            method: "PUT",
            url: `/extras/education/${edu.id}`,
            data,
          });
        }
      }
    });

    return requests;
  }

  async function submitEdit(e) {
    e.preventDefault();
    let requests = [];

    const formErrors = checkFormErrors();
    if (formErrors.length > 0) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    if (educationChange) {
      const newEduRequests = addNewEducation();
      const removeEduRequests = removeUserEducation();
      requests = [...newEduRequests, ...removeEduRequests];
    }

    const userEduChange = education.filter(
      (edu) =>
        Number.isInteger(edu.id) &&
        (edu.schoolChange ||
          edu.fieldOfStudyChange ||
          edu.descriptionChange ||
          edu.schoolFromDateChange ||
          edu.schoolToDateChange)
    );

    if (userEduChange.length > 0) {
      const updatedEduRequests = updateUserEducation();
      requests = [...requests, ...updatedEduRequests];
    }

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
    formErrors = checkFormErrors();
  }

  console.log("-- Dash Education --");

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
                <ul key={edu.id} aria-label={`current ${edu.school} errors`}>
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

                  {edu.schoolFromMonth === "" ? (
                    <li>
                      <a href={`#from-month-${edu.id}`}>From Month Error</a>
                    </li>
                  ) : null}

                  {edu.schoolFromYear === "" ? (
                    <li>
                      <a href={`#from-year-${edu.id}`}>From Year Error</a>
                    </li>
                  ) : null}

                  {edu.schoolToMonth === "" ? (
                    <li>
                      <a href={`#to-month-${edu.id}`}>To Month Error</a>
                    </li>
                  ) : null}

                  {edu.schoolToYear === "" ? (
                    <li>
                      <a href={`#to-year-${edu.id}`}>To Year Error</a>
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
            <div key={edu.id}>
              <EducationForm
                eduIndex={index}
                userId={edu.id}
                userSchool={edu.school}
                userFieldOfStudy={edu.field_of_study}
                userFromMonth={edu.schoolFromMonth}
                userFromYear={edu.schoolFromYear}
                userToMonth={edu.schoolToMonth}
                userToYear={edu.schoolToYear}
                userToPresent={edu.schoolToPresent}
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
