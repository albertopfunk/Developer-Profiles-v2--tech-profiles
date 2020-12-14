import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import useCurrentYear from "../../../global/helpers/hooks/useCurrentYear";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

import EducationForm from "../../../components/forms/user-extras/EducationForm";

let formSuccessWait;
function DashboardEducation() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const currentYear = useCurrentYear();
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

  function splitDates(dates) {
    const schoolDatesArr = dates.split(" - ");
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
      schoolFromMonth,
      schoolFromYear,
      schoolToMonth,
      schoolToYear,
      schoolToPresent,
    };
  }

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);

    const updatedUserEducation = user.education.map((edu) => {
      const schoolDatesObj = splitDates(edu.school_dates);

      return {
        ...edu,
        schoolNameInput: edu.school,
        schoolStatus: FORM_STATUS.idle,
        schoolChange: false,

        fieldOfStudyInput: edu.field_of_study,
        fieldOfStudyStatus: FORM_STATUS.idle,
        fieldOfStudyChange: false,

        descriptionInput: edu.education_description,
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,

        schoolDateChange: false,
        ...schoolDatesObj,
      };
    });

    setEducation(updatedUserEducation);
  }

  function updateEducation(index, state) {
    const newEduArr = [...education];
    const newEduObj = { ...newEduArr[index], ...state };
    newEduArr.splice(index, 1, newEduObj);
    setEducation(newEduArr);
  }

  function addEducation(e) {
    e.preventDefault();

    setEducation([
      ...education,

      {
        id: `new-${idTracker}`,

        schoolNameInput: "",
        schoolStatus: FORM_STATUS.idle,
        schoolChange: false,

        fieldOfStudyInput: "",
        fieldOfStudyStatus: FORM_STATUS.idle,
        fieldOfStudyChange: false,

        descriptionInput: "",
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,

        schoolFromMonth: "",
        schoolFromYear: "",
        schoolToMonth: "",
        schoolToYear: "",
        schoolToPresent: "",
        schoolDateChange: false,
      },
    ]);

    setIdTracker(idTracker + 1);
    setEducationChange(true);
  }

  function removeEducation(id) {
    const newEducation = education.filter((edu) => edu.id !== id);
    setEducation(newEducation);
    setEducationChange(true);
  }

  function checkFormErrors() {
    return education.filter((edu) => {
      let isErrors = false;
      if (
        edu.schoolNameInput.trim() === "" ||
        edu.schoolStatus === FORM_STATUS.error ||
        edu.fieldOfStudyInput.trim() === "" ||
        edu.fieldOfStudyStatus === FORM_STATUS.error ||
        edu.descriptionInput.trim() === "" ||
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
            school: edu.schoolNameInput,
            school_dates,
            field_of_study: edu.fieldOfStudyInput,
            education_description: edu.descriptionInput,
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
          edu.schoolDateChange
        ) {
          const data = {};
          if (edu.schoolChange) {
            data.school = edu.schoolNameInput;
          }

          if (edu.fieldOfStudyChange) {
            data.field_of_study = edu.fieldOfStudyInput;
          }

          if (edu.descriptionChange) {
            data.education_description = edu.descriptionInput;
          }

          if (edu.schoolDateChange) {
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
          edu.schoolDateChange)
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
      <>
        <Helmet>
          <title>Profile Dashboard Education • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Education</h1>

        <section
          id="profile-information"
          tabIndex="-1"
          aria-labelledby="current-information-heading"
        >
          <h2 id="current-information-heading">Current Information</h2>
          <button onClick={setFormInputs}>Edit Information</button>
          {user.education.length > 0 ? (
            user.education.map((edu) => (
              <div key={edu.id}>
                <h3>{`Current "${edu.school}" Education`}</h3>
                <ul aria-label={`${edu.school} Education`}>
                  <li>School: {edu.school}</li>
                  <li>Field of Study: {edu.field_of_study}</li>
                  <li>Dates: {edu.school_dates}</li>
                  <li>Description: {edu.education_description}</li>
                </ul>
              </div>
            ))
          ) : (
            <p>No Education</p>
          )}
        </section>
      </>
    );
  }

  let formErrors;
  if (formStatus === FORM_STATUS.error) {
    formErrors = checkFormErrors();
  }

  return (
    <>
      <Helmet>
        <title>Profile Dashboard Education • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Education</h1>

      <section
        id="profile-information"
        tabIndex="-1"
        aria-labelledby="edit-information-heading"
      >
        <h2 id="edit-information-heading">Edit Information</h2>

        {formStatus === FORM_STATUS.error ? (
          <div ref={errorSummaryRef} tabIndex="-1">
            <h3 id="error-heading">Errors in Submission</h3>
            <>
              <strong>
                Please address the following errors and re-submit the form:
              </strong>

              {formErrors.length > 0 ? (
                formErrors.map((edu) => (
                  <div key={edu.id}>
                    <h4>{`Current "${
                      edu.schoolNameInput || "New Education"
                    }" Errors`}</h4>
                    <ul
                      aria-label={`current ${
                        edu.schoolNameInput || "new education"
                      } errors`}
                    >
                      {edu.schoolNameInput.trim() === "" ||
                      edu.schoolStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#school-${edu.id}`}>School Error</a>
                        </li>
                      ) : null}

                      {edu.fieldOfStudyInput.trim() === "" ||
                      edu.fieldOfStudyStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#field-of-study-${edu.id}`}>
                            Field of Study Error
                          </a>
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

                      {edu.descriptionInput.trim() === "" ||
                      edu.descriptionStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#description-${edu.id}`}>
                            Description Error
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
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

        <div>
          <button
            form="education-form"
            type="button"
            aria-label="add new education"
            onClick={(e) => addEducation(e)}
          >
            + New Education
          </button>
          <form id="education-form" onSubmit={(e) => submitEdit(e)}>
            {education.map((edu, index) => {
              return (
                <div key={edu.id}>
                  <EducationForm
                    eduIndex={index}
                    userId={edu.id}
                    currentYear={currentYear}
                    userSchool={edu.school || ""}
                    userFieldOfStudy={edu.field_of_study || ""}
                    userFromMonth={edu.schoolFromMonth}
                    userFromYear={edu.schoolFromYear}
                    userToMonth={edu.schoolToMonth}
                    userToYear={edu.schoolToYear}
                    userToPresent={edu.schoolToPresent}
                    userDescription={edu.education_description || ""}
                    updateEducation={updateEducation}
                    removeEducation={removeEducation}
                  />
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
        </div>
      </section>
    </>
  );
}

export default DashboardEducation;
