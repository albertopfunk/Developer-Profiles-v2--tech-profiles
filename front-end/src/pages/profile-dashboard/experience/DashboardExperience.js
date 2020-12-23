import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import useCurrentYear from "../../../global/helpers/hooks/useCurrentYear";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

import ExperienceForm from "../../../components/forms/user-extras/ExperienceForm";

let formSuccessWait;
function DashboardExperience() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const currentYear = useCurrentYear();
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [experience, setExperience] = useState([]);
  const [experienceChange, setExperienceChange] = useState(false);
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
    const datesArr = dates.split(" - ");
    const fromDate = datesArr[0];
    const toDate = datesArr[1];
    const fromMonth = fromDate.split(" ")[0];
    const fromYear = fromDate.split(" ")[1];

    let toMonth;
    let toYear;
    let toPresent;
    if (toDate === "Present") {
      toPresent = "Present";
      toMonth = "";
      toYear = "";
    } else {
      toPresent = "";
      toMonth = toDate.split(" ")[0];
      toYear = toDate.split(" ")[1];
    }

    return {
      fromMonth,
      fromYear,
      toMonth,
      toYear,
      toPresent,
    };
  }

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);

    const updatedUserExperience = user.experience.map((exp) => {
      const datesObj = splitDates(exp.job_dates);

      return {
        ...exp,
        companyNameInput: exp.company_name,
        companyStatus: FORM_STATUS.idle,
        companyChange: false,

        titleInput: exp.job_title,
        titleStatus: FORM_STATUS.idle,
        titleChange: false,

        descriptionInput: exp.job_description,
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,

        dateChange: false,
        ...datesObj,
      };
    });

    setExperience(updatedUserExperience);
  }

  function updateExperience(index, state) {
    const newExpArr = [...experience];
    const newExpObj = { ...newExpArr[index], ...state };
    newExpArr.splice(index, 1, newExpObj);
    setExperience(newExpArr);
  }

  function addExperience(e) {
    e.preventDefault();

    setExperience([
      ...experience,

      {
        id: `new-${idTracker}`,

        companyNameInput: "",
        companyStatus: FORM_STATUS.idle,
        companyChange: false,

        titleInput: "",
        titleStatus: FORM_STATUS.idle,
        titleChange: false,

        descriptionInput: "",
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,

        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        toPresent: "",
        dateChange: false,
      },
    ]);

    setIdTracker(idTracker + 1);
    setExperienceChange(true);
  }

  function removeExperience(id) {
    const newExperience = experience.filter((exp) => exp.id !== id);
    setExperience(newExperience);
    setExperienceChange(true);
  }

  function checkFormErrors() {
    return experience.filter((exp) => {
      let isErrors = false;
      if (
        exp.companyNameInput.trim() === "" ||
        exp.companyStatus === FORM_STATUS.error ||
        exp.titleInput.trim() === "" ||
        exp.titleStatus === FORM_STATUS.error ||
        exp.descriptionInput.trim() === "" ||
        exp.descriptionStatus === FORM_STATUS.error ||
        exp.fromMonth === "" ||
        exp.fromYear === ""
      ) {
        isErrors = true;
      }

      if (exp.toPresent === "" && (exp.toMonth === "" || exp.toYear === "")) {
        isErrors = true;
      }

      return isErrors;
    });
  }

  function addNewExperience() {
    const requests = [];

    experience.forEach((exp) => {
      if (!Number.isInteger(exp.id)) {
        const fromDates = `${exp.fromMonth} ${exp.fromYear}`;
        const toDates = exp.toPresent
          ? "Present"
          : `${exp.toMonth} ${exp.toYear}`;

        const job_dates = `${fromDates} - ${toDates}`;

        requests.push({
          method: "POST",
          url: `/extras/new/experience`,
          data: {
            company_name: exp.companyNameInput,
            job_dates,
            job_title: exp.titleInput,
            job_description: exp.descriptionInput,
            user_id: user.id,
          },
        });
      }
    });

    return requests;
  }

  function removeUserExperience() {
    const requests = [];
    const experienceObj = {};

    experience.forEach((exp) => {
      if (Number.isInteger(exp.id)) {
        experienceObj[exp.id] = true;
      }
    });

    user.experience.forEach((exp) => {
      if (!(exp.id in experienceObj)) {
        requests.push({
          method: "DELETE",
          url: `/extras/experience/${exp.id}`,
        });
      }
    });

    return requests;
  }

  function updateUserExperience() {
    const requests = [];

    experience.forEach((exp) => {
      if (Number.isInteger(exp.id)) {
        if (
          exp.companyChange ||
          exp.titleChange ||
          exp.descriptionChange ||
          exp.dateChange
        ) {
          const data = {};
          if (exp.companyChange) {
            data.company_name = exp.companyNameInput;
          }

          if (exp.titleChange) {
            data.job_title = exp.titleInput;
          }

          if (exp.descriptionChange) {
            data.job_description = exp.descriptionInput;
          }

          if (exp.dateChange) {
            const fromDates = `${exp.fromMonth} ${exp.fromYear}`;
            const toDates = exp.toPresent
              ? "Present"
              : `${exp.toMonth} ${exp.toYear}`;

            data.job_dates = `${fromDates} - ${toDates}`;
          }

          requests.push({
            method: "PUT",
            url: `/extras/experience/${exp.id}`,
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

    if (experienceChange) {
      const newExpRequests = addNewExperience();
      const removeExpRequests = removeUserExperience();
      requests = [...newExpRequests, ...removeExpRequests];
    }

    const userExpChange = experience.filter(
      (exp) =>
        Number.isInteger(exp.id) &&
        (exp.companyChange ||
          exp.titleChange ||
          exp.descriptionChange ||
          exp.dateChange)
    );

    if (userExpChange.length > 0) {
      const updatedExpRequests = updateUserExperience();
      requests = [...requests, ...updatedExpRequests];
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
          <title>Profile Dashboard Experience • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Experience</h1>

        <section aria-labelledby="current-information-heading">
          <h2 id="current-information-heading">Current Information</h2>
          <button data-main-content="true" onClick={setFormInputs}>
            Edit Information
          </button>
          {user.experience.length > 0 ? (
            user.experience.map((exp) => (
              <div key={exp.id}>
                <h3>{`Current "${exp.company_name}" Experience`}</h3>
                <ul aria-label={`${exp.company_name} Experience`}>
                  <li>Company: {exp.company_name}</li>
                  <li>Job Title: {exp.job_title}</li>
                  <li>Dates: {exp.job_dates}</li>
                  <li>Description: {exp.job_description}</li>
                </ul>
              </div>
            ))
          ) : (
            <p>No Experience</p>
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
        <title>Profile Dashboard Experience • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Experience</h1>

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
                formErrors.map((exp) => (
                  <div key={exp.id}>
                    <h4>{`Current "${
                      exp.companyNameInput || "New Experience"
                    }" Errors`}</h4>

                    <ul
                      aria-label={`current ${
                        exp.companyNameInput || "new experience"
                      } errors`}
                    >
                      {exp.companyNameInput.trim() === "" ||
                      exp.companyStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#company-${exp.id}`}>Company Name Error</a>
                        </li>
                      ) : null}

                      {exp.titleInput.trim() === "" ||
                      exp.titleStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#title-${exp.id}`}>Title Error</a>
                        </li>
                      ) : null}

                      {exp.fromMonth === "" ? (
                        <li>
                          <a href={`#from-month-${exp.id}`}>From Month Error</a>
                        </li>
                      ) : null}

                      {exp.fromYear === "" ? (
                        <li>
                          <a href={`#from-year-${exp.id}`}>From Year Error</a>
                        </li>
                      ) : null}

                      {exp.toMonth === "" ? (
                        <li>
                          <a href={`#to-month-${exp.id}`}>To Month Error</a>
                        </li>
                      ) : null}

                      {exp.toYear === "" ? (
                        <li>
                          <a href={`#to-year-${exp.id}`}>To Year Error</a>
                        </li>
                      ) : null}

                      {exp.descriptionInput.trim() === "" ||
                      exp.descriptionStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#description-${exp.id}`}>
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
            form="experience-form"
            type="button"
            aria-label="add new experience"
            onClick={(e) => addExperience(e)}
          >
            + New Experience
          </button>

          <form id="experience-form" onSubmit={(e) => submitEdit(e)}>
            {experience.map((exp, index) => {
              return (
                <div key={exp.id}>
                  <ExperienceForm
                    expIndex={index}
                    userId={exp.id}
                    currentYear={currentYear}
                    userCompanyName={exp.company_name || ""}
                    userJobTitle={exp.job_title || ""}
                    userFromMonth={exp.fromMonth}
                    userFromYear={exp.fromYear}
                    userToMonth={exp.toMonth}
                    userToYear={exp.toYear}
                    userToPresent={exp.toPresent}
                    userDescription={exp.job_description || ""}
                    updateExperience={updateExperience}
                    removeExperience={removeExperience}
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

export default DashboardExperience;
