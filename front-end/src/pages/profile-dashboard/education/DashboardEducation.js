import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";
import { ReactComponent as AddIcon } from "../../../global/assets/dashboard-add.svg";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import useCurrentYear from "../../../global/helpers/hooks/useCurrentYear";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

import EducationForm from "../../../components/forms/user-extras/EducationForm";

let formSuccessWait;
function DashboardEducation() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const currentYear = useCurrentYear();

  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [hasSubmitError, setHasSubmitError] = useState(null);
  const [education, setEducation] = useState([]);
  const [educationChange, setEducationChange] = useState(false);
  const [removedEduIndex, setRemovedEduIndex] = useState(null);
  const [removedEduUpdate, setRemovedEduUpdate] = useState(true);
  const [idTracker, setIdTracker] = useState(1);

  const errorSummaryRef = React.createRef();
  const editInfoBtnRef = React.createRef();
  const addNewBtnRef = React.createRef();
  const removeBtnRefs = useRef([]);

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  useEffect(() => {
    if (removedEduIndex === null) {
      return;
    }

    if (removeBtnRefs.current.length === 0) {
      addNewBtnRef.current.focus();
      return;
    }

    if (removeBtnRefs.current.length === 1) {
      removeBtnRefs.current[0].current.focus();
      return;
    }

    if (removeBtnRefs.current[removedEduIndex]) {
      removeBtnRefs.current[removedEduIndex].current.focus();
    } else {
      removeBtnRefs.current[removedEduIndex - 1].current.focus();
    }
  }, [removedEduUpdate]);

  useEffect(() => {
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        addNewBtnRef.current.focus();
      }
    }
  }, [formFocusStatus]);

  function formFocusAction(e, status) {
    // enter/space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    if (status === FORM_STATUS.active) {
      setFormInputs();
      setFormFocusStatus(FORM_STATUS.active);
      return;
    }

    if (status === FORM_STATUS.idle) {
      resetForm();
      setFormFocusStatus(FORM_STATUS.idle);
    }
  }

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

    removeBtnRefs.current = updatedUserEducation.map(() => React.createRef());
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

    const currentEducation = [
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
    ];

    removeBtnRefs.current = currentEducation.map(() => React.createRef());
    setEducation(currentEducation);
    setIdTracker(idTracker + 1);
    setEducationChange(true);
  }

  function removeEducation(eduIndex) {
    const newEducation = [...education];
    newEducation.splice(eduIndex, 1);
    removeBtnRefs.current = newEducation.map(() => React.createRef());
    setEducation(newEducation);
    setRemovedEduIndex(eduIndex);
    setRemovedEduUpdate(!removedEduUpdate);
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
    if (formErrors.length > 0 || hasSubmitError) {
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

    const results = await addUserExtras(requests);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      return;
    }

    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
      setHasSubmitError(null);
    }, 750);

    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <InfoSection aria-labelledby="current-information-heading">
        <div className="info-heading">
          <h2 id="current-information-heading">Current Info</h2>
          <button
            ref={editInfoBtnRef}
            id="edit-info-btn"
            className="button edit-button"
            data-main-content="true"
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusAction(e, FORM_STATUS.active)}
          >
            <span className="sr-only">Edit Information</span>
            <span className="button-icon">
              <EditIcon className="icon" />
            </span>
          </button>
        </div>
        <Spacer axis="vertical" size="10" />
        <div className="grid-container">
          {user.education.length > 0 ? (
            user.education.map((edu) => (
              <div key={edu.id}>
                <h3>{edu.school}</h3>
                <Spacer axis="vertical" size="10" />
                <dl
                  className="info-group"
                  aria-label={`${edu.school} Education`}
                >
                  <div className="flex-row">
                    <div className="flex-col">
                      <div>
                        <dt>School:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{edu.school}</dd>
                      </div>
                      <div>
                        <dt>Field of Study:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{edu.field_of_study}</dd>
                      </div>
                    </div>
                    <div className="flex-col">
                      <div>
                        <dt>Dates:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{edu.school_dates}</dd>
                      </div>
                      <div>
                        <dt>Description:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{edu.education_description}</dd>
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            ))
          ) : (
            <p>No Education</p>
          )}
        </div>
      </InfoSection>
    );
  }

  let formErrors;
  if (formStatus === FORM_STATUS.error) {
    formErrors = checkFormErrors();
  }

  return (
    <FormSection aria-labelledby="edit-information-heading">
      <h2 id="edit-information-heading">Edit Info</h2>
      <Spacer axis="vertical" size="15" />
      {formStatus === FORM_STATUS.error ? (
        <div ref={errorSummaryRef} tabIndex="-1">
          <h3 id="error-heading">Errors in Submission</h3>
          <>
            <strong>
              Please address the following errors and re-submit the form:
            </strong>

            {hasSubmitError ? (
              <div>
                <h4>Submit Error</h4>
                <p>Error submitting form, please try again</p>
              </div>
            ) : null}

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
                        <a href={`#description-${edu.id}`}>Description Error</a>
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

      <div className="form-container">
        <button
          ref={addNewBtnRef}
          id="add-new-btn"
          className="button button-control add-button"
          data-main-content="true"
          form="education-form"
          type="button"
          aria-label="add new education"
          onClick={(e) => addEducation(e)}
        >
          <div className="button-text">
            <span className="text">New Education</span>
            <span className="icon-container">
              <AddIcon className="icon" />
            </span>
          </div>
        </button>

        <form id="education-form" onSubmit={(e) => submitEdit(e)}>
          <div className="flex-container">
            {education.map((edu, index) => {
              return (
                <div key={edu.id}>
                  <EducationForm
                    ref={removeBtnRefs.current[index]}
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
          </div>
          <Spacer axis="vertical" size="25" />
          <div className="button-container">
            <button
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              type="submit"
              className="button button-control"
            >
              <span className="button-text">
                {formStatus === FORM_STATUS.active ? "Submit" : null}
                {formStatus === FORM_STATUS.loading ? "loading..." : null}
                {formStatus === FORM_STATUS.success ? "Success!" : null}
                {formStatus === FORM_STATUS.error ? "Re-Submit" : null}
              </span>
            </button>
            <button
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              type="reset"
              className="button button-control"
              onClick={resetForm}
              onKeyDown={(e) => formFocusAction(e, FORM_STATUS.idle)}
            >
              <span className="button-text">Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </FormSection>
  );
}

const InfoSection = styled.section`
  .info-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;

    .edit-button {
      width: 100%;
      max-width: 40px;
      border-radius: 10px;
      height: 40px;
      padding: 8px;

      &:focus-visible {
        outline-width: 3px;
        outline-color: transparent;
        box-shadow: inset 0 0 1px 2.5px #2727ad;
      }

      &:hover .icon {
        fill: #2727ad;
      }

      .icon {
        height: 100%;
      }
    }
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
    justify-items: stretch;
    align-items: start;
    grid-gap: 35px;
  }

  .info-group {
    width: 95%;
    max-width: 500px;

    .image-container {
      width: 95%;
      max-width: 175px;

      @media (min-width: 400px) {
        width: 200px;
      }

      img {
        width: 100%;
      }
    }

    .flex-row {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px;

      @media (min-width: 300px) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
      }

      .flex-col {
        flex-basis: 0;
        flex-shrink: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 20px;
      }
    }
  }
`;

const FormSection = styled.section`
  .form-container {
    .flex-container {
      display: flex;
      flex-direction: column;
      gap: 50px;
    }

    .add-button {
      width: 100%;
      max-width: 350px;
      margin-bottom: 30px;
      font-size: 0.9rem;

      .button-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;

        .icon {
          height: 1rem;
        }
      }
    }
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;

    button {
      width: 100%;
      max-width: 350px;

      .button-text {
        padding: 7px 0;
      }
    }
  }
`;

export default DashboardEducation;
