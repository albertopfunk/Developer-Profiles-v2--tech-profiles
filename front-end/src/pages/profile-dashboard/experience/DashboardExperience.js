import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";
import { ReactComponent as AddIcon } from "../../../global/assets/dashboard-add.svg";

import ExperienceForm from "../../../components/forms/user-extras/ExperienceForm";
import ControlButton from "../../../components/forms/buttons/ControlButton";
import IconButton from "../../../components/forms/buttons/IconButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import useCurrentYear from "../../../global/helpers/hooks/useCurrentYear";
import { FORM_STATUS } from "../../../global/helpers/variables";
import { validateInput } from "../../../global/helpers/validation";
import useToggle from "../../../global/helpers/hooks/useToggle";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

let formSuccessWait;
function DashboardExperience() {
  const { user, addUserExtras } = useContext(ProfileContext);

  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [formFocusToggle, setFormFocusToggle] = useToggle();
  const [hasSubmitError, setHasSubmitError] = useState(null);

  const [experience, setExperience] = useState([]);
  const [experienceChange, setExperienceChange] = useState(false);
  const [newExperienceId, setNewExperienceId] = useState(1);
  const [removedExperienceIndex, setRemovedExperienceIndex] = useState(null);
  const [
    removeExperienceFocusToggle,
    setRemoveExperienceFocusToggle,
  ] = useToggle();

  const currentYear = useCurrentYear();

  let isSubmittingRef = useRef(false);
  const errorSummaryRef = React.createRef();
  const editInfoBtnRef = React.createRef();
  const resetBtnRef = React.createRef();
  const addNewBtnRef = React.createRef();
  const removeBtnRefs = useRef([]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  // form focus management
  useEffect(() => {
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        resetBtnRef.current.focus();
      }
    }
  }, [formFocusToggle]);

  // form error focus management
  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  // remove experience focus management
  useEffect(() => {
    if (removedExperienceIndex === null) {
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

    if (removeBtnRefs.current[removedExperienceIndex]) {
      removeBtnRefs.current[removedExperienceIndex].current.focus();
    } else {
      removeBtnRefs.current[removedExperienceIndex - 1].current.focus();
    }
  }, [removeExperienceFocusToggle]);

  function formFocusManagement(e, status) {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    if (status === FORM_STATUS.active) {
      setFormInputs();
      setFormFocusToggle();
      return;
    }

    if (status === FORM_STATUS.idle) {
      resetForm();
      setFormFocusToggle();
    }
  }

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
      userFromMonth: fromMonth,
      fromMonth,
      userFromYear: fromYear,
      fromYear,
      userToMonth: toMonth,
      toMonth,
      userToYear: toYear,
      toYear,
      userToPresent: toPresent,
      toPresent,
    };
  }

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);
    setFormFocusStatus(FORM_STATUS.active);
    setHasSubmitError(null);

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

        fromMonthStatus: FORM_STATUS.idle,
        fromMonthChange: false,
        fromYearStatus: FORM_STATUS.idle,
        fromYearChange: false,
        toMonthStatus: FORM_STATUS.idle,
        toMonthChange: false,
        toYearStatus: FORM_STATUS.idle,
        toYearChange: false,
        ...datesObj,
      };
    });

    setExperience(updatedUserExperience);
    setExperienceChange(false);
    setNewExperienceId(1);
    setRemovedExperienceIndex(null);
    removeBtnRefs.current = updatedUserExperience.map(() => React.createRef());
  }

  function updateExperience(index, state, checkChanges = false) {
    const newExpArr = [...experience];
    const newExpObj = { ...newExpArr[index], ...state };
    newExpArr.splice(index, 1, newExpObj);
    setExperience(newExpArr);

    if (checkChanges) {
      const userExpChange = newExpArr.filter(
        (exp) =>
          Number.isInteger(exp.id) &&
          (exp.companyChange ||
            exp.titleChange ||
            exp.descriptionChange ||
            exp.fromMonthChange ||
            exp.fromYearChange ||
            exp.toMonthChange ||
            exp.toYearChange)
      );

      // set form back to active if no changes
      if (userExpChange.length === 0 && !experienceChange) {
        setFormStatus(FORM_STATUS.active);
      }
    }
  }

  function addExperience(e) {
    e.preventDefault();

    const currentExperience = [
      ...experience,

      {
        id: `new-${newExperienceId}`,

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
        fromMonthStatus: FORM_STATUS.idle,
        fromMonthChange: false,
        fromYear: "",
        fromYearStatus: FORM_STATUS.idle,
        fromYearChange: false,
        toMonth: "",
        toMonthStatus: FORM_STATUS.idle,
        toMonthChange: false,
        toYear: "",
        toYearStatus: FORM_STATUS.idle,
        toYearChange: false,
        toPresent: "",
      },
    ];

    removeBtnRefs.current = currentExperience.map(() => React.createRef());
    setExperience(currentExperience);
    setNewExperienceId(newExperienceId + 1);
    setExperienceChange(true);
  }

  function removeExperienceFocusManagement(e, expIndex) {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    removeExperience(expIndex);
    setRemoveExperienceFocusToggle();
  }

  function removeExperience(expIndex) {
    const newExperience = [...experience];
    newExperience.splice(expIndex, 1);
    removeBtnRefs.current = newExperience.map(() => React.createRef());
    setExperience(newExperience);
    setRemovedExperienceIndex(expIndex);
    setExperienceChanges(newExperience);
  }

  function setExperienceChanges(experience) {
    let savedExperience = [];
    let newExperience = [];

    experience.forEach((exp) => {
      if (Number.isInteger(exp.id)) {
        savedExperience.push(exp);
      } else {
        newExperience.push(exp);
      }
    });

    if (
      newExperience.length > 0 ||
      savedExperience.length !== user.experience.length
    ) {
      setExperienceChange(true);
      return;
    }

    // checking input changes if no experience change
    const savedExperienceChange = savedExperience.filter(
      (exp) =>
        exp.companyChange ||
        exp.titleChange ||
        exp.descriptionChange ||
        exp.fromMonthChange ||
        exp.fromYearChange ||
        exp.toMonthChange ||
        exp.toYearChange
    );

    // set form back to active if no changes
    if (savedExperienceChange.length === 0) {
      setFormStatus(FORM_STATUS.active);
    }

    setExperienceChange(false);
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
          exp.fromMonthChange ||
          exp.fromYearChange ||
          exp.toMonthChange ||
          exp.toYearChange
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

          if (
            exp.fromMonthChange ||
            exp.fromYearChange ||
            exp.toMonthChange ||
            exp.toYearChange
          ) {
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

    // check for changes
    const userExpChange = experience.filter(
      (exp) =>
        Number.isInteger(exp.id) &&
        (exp.companyChange ||
          exp.titleChange ||
          exp.descriptionChange ||
          exp.fromMonthChange ||
          exp.fromYearChange ||
          exp.toMonthChange ||
          exp.toYearChange)
    );

    if (userExpChange.length === 0 && !experienceChange) {
      return;
    }

    // set loading
    setFormStatus(FORM_STATUS.loading);
    isSubmittingRef.current = true;

    // validate experience
    const currentExperience = [...experience];
    let areThereErrors = false;

    experience.forEach((exp, expIndex) => {
      const newState = {};

      if (exp.companyChange || exp.companyNameInput.trim() === "") {
        if (exp.companyNameInput.trim() === "") {
          areThereErrors = true;
          newState.companyNameInput = "";
          newState.companyStatus = FORM_STATUS.error;
        } else if (validateInput("title", exp.companyNameInput)) {
          newState.companyStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.companyStatus = FORM_STATUS.error;
        }
      }

      if (exp.titleChange || exp.titleInput.trim() === "") {
        if (exp.titleInput.trim() === "") {
          areThereErrors = true;
          newState.titleInput = "";
          newState.titleStatus = FORM_STATUS.error;
        } else if (validateInput("title", exp.titleInput)) {
          newState.titleStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.titleStatus = FORM_STATUS.error;
        }
      }

      if (exp.descriptionChange || exp.descriptionInput.trim() === "") {
        if (exp.descriptionInput.trim() === "") {
          areThereErrors = true;
          newState.descriptionInput = "";
          newState.descriptionStatus = FORM_STATUS.error;
        } else if (validateInput("summary", exp.descriptionInput)) {
          newState.descriptionStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.descriptionStatus = FORM_STATUS.error;
        }
      }

      if (exp.fromMonthChange || !exp.fromMonth) {
        if (!exp.fromMonth) {
          areThereErrors = true;
          newState.fromMonthStatus = FORM_STATUS.error;
        } else {
          newState.fromMonthStatus = FORM_STATUS.success;
        }
      }

      if (exp.fromYearChange || !exp.fromYear) {
        if (!exp.fromMonth) {
          areThereErrors = true;
          newState.fromYearStatus = FORM_STATUS.error;
        } else {
          newState.fromYearStatus = FORM_STATUS.success;
        }
      }

      if (!exp.toPresent) {
        if (exp.toMonthChange || !exp.toMonth) {
          if (!exp.toMonth) {
            areThereErrors = true;
            newState.toMonthStatus = FORM_STATUS.error;
          } else {
            newState.toMonthStatus = FORM_STATUS.success;
          }
        }

        if (exp.toYearChange || !exp.toYear) {
          if (!exp.toYear) {
            areThereErrors = true;
            newState.toYearStatus = FORM_STATUS.error;
          } else {
            newState.toYearStatus = FORM_STATUS.success;
          }
        }
      }

      currentExperience.splice(expIndex, 1, {
        ...currentExperience[expIndex],
        ...newState,
      });
    });

    setExperience(currentExperience);

    if (areThereErrors) {
      isSubmittingRef.current = false;
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    // unfocus from input
    let element = document.activeElement;
    if (element.dataset.input) {
      element.blur();
    }

    // create requests
    let requests = [];

    if (experienceChange) {
      const newExpRequests = addNewExperience();
      const removeExpRequests = removeUserExperience();
      requests = [...newExpRequests, ...removeExpRequests];
    }

    if (userExpChange.length > 0) {
      const updatedExpRequests = updateUserExperience();
      requests = [...requests, ...updatedExpRequests];
    }

    if (requests.length === 0) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      isSubmittingRef.current = false;
      return;
    }

    // submit
    const results = await addUserExtras(requests);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      isSubmittingRef.current = false;
      return;
    }

    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
      setFormFocusStatus(FORM_STATUS.idle);
      isSubmittingRef.current = false;
    }, 750);
    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
    setFormFocusStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <InfoSection aria-labelledby="current-information-heading">
        <div className="info-heading">
          <h2 id="current-information-heading">Current Info</h2>
          <IconButton
            ref={editInfoBtnRef}
            type="button"
            ariaLabel="edit information"
            icon={<EditIcon className="icon" />}
            attributes={{
              id: "edit-info-btn",
            }}
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusManagement(e, FORM_STATUS.active)}
          />
        </div>
        <Spacer axis="vertical" size="30" />
        <div className="grid-container">
          {user.experience.length > 0 ? (
            user.experience.map((exp) => (
              <div key={exp.id}>
                <h3>{exp.company_name}</h3>
                <Spacer axis="vertical" size="10" />
                <dl
                  className="info-group"
                  aria-label={`${exp.company_name} Experience`}
                >
                  <div className="flex-row">
                    <div className="flex-col">
                      <div>
                        <dt>Company:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{exp.company_name}</dd>
                      </div>
                      <div>
                        <dt>Job Title:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{exp.job_title}</dd>
                      </div>
                    </div>

                    <div className="flex-col">
                      <div>
                        <dt>Dates:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{exp.job_dates}</dd>
                      </div>
                      <div>
                        <dt>Description:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{exp.job_description}</dd>
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            ))
          ) : (
            <p>No Experience</p>
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
      <div className="edit-info-header">
        <h2 id="edit-information-heading">Edit Info</h2>
        <IconButton
          ref={resetBtnRef}
          type="reset"
          disabled={
            formStatus === FORM_STATUS.loading ||
            formStatus === FORM_STATUS.success
          }
          ariaLabel="cancel"
          icon={<CloseIcon className="icon" />}
          attributes={{
            form: "experience-form",
          }}
          onClick={resetForm}
          onKeyDown={(e) => formFocusManagement(e, FORM_STATUS.idle)}
        />
      </div>

      {formStatus === FORM_STATUS.error ? (
        <>
          <Spacer axis="vertical" size="30" />
          <div ref={errorSummaryRef} tabIndex="-1" className="error-summary">
            <h3 id="error-heading">Errors in Submission</h3>
            <Spacer axis="vertical" size="10" />
            <>
              <strong>
                Please address the following errors and re-submit the form:
              </strong>
              <Spacer axis="vertical" size="10" />
              {hasSubmitError ? (
                <div>
                  <h4>Submit Error</h4>
                  <p>Error submitting form, please try again</p>
                </div>
              ) : null}
              <Spacer axis="vertical" size="10" />
              {formErrors.length > 0 ? (
                formErrors.map((exp, index) => (
                  <div key={exp.id}>
                    {index !== 0 ? <Spacer axis="vertical" size="15" /> : null}
                    <div>
                      <h4>{`Current "${
                        exp.companyNameInput || "New Experience"
                      }" Errors`}</h4>
                      <Spacer axis="vertical" size="5" />
                      <ul
                        aria-label={`current ${
                          exp.companyNameInput || "new experience"
                        } errors`}
                      >
                        {exp.companyNameInput.trim() === "" ||
                        exp.companyStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#company-${exp.id}`}>
                              Company Name Error
                            </a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {exp.titleInput.trim() === "" ||
                        exp.titleStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#title-${exp.id}`}>Title Error</a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {exp.fromMonth === "" ? (
                          <li>
                            <a href={`#from-month-${exp.id}`}>
                              From Month Error
                            </a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {exp.fromYear === "" ? (
                          <li>
                            <a href={`#from-year-${exp.id}`}>From Year Error</a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {!exp.toPresent && exp.toMonth === "" ? (
                          <li>
                            <a href={`#to-month-${exp.id}`}>To Month Error</a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {!exp.toPresent && exp.toYear === "" ? (
                          <li>
                            <a href={`#to-year-${exp.id}`}>To Year Error</a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
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
        </>
      ) : null}
      <Spacer axis="vertical" size="30" />
      <div className="form-container">
        <ControlButton
          ref={addNewBtnRef}
          type="button"
          onClick={(e) => addExperience(e)}
          classNames="add-button"
          buttonText="new experience"
          ariaLabel="add"
          attributes={{
            id: "add-new-btn",
            form: "experience-form",
          }}
        >
          <span className="icon-container">
            <AddIcon className="icon" />
          </span>
        </ControlButton>
        <Spacer axis="vertical" size="20" />
        <form id="experience-form" onSubmit={(e) => submitEdit(e)}>
          <div className="flex-container">
            {experience.map((exp, index) => {
              return (
                <div key={exp.id}>
                  <ExperienceForm
                    ref={removeBtnRefs.current[index]}
                    expIndex={index}
                    userId={exp.id}
                    currentYear={currentYear}
                    userCompanyName={exp.company_name || ""}
                    company={{
                      companyNameInput: exp.companyNameInput,
                      companyStatus: exp.companyStatus,
                      companyChange: exp.companyChange,
                    }}
                    userJobTitle={exp.job_title || ""}
                    title={{
                      titleInput: exp.titleInput,
                      titleStatus: exp.titleStatus,
                      titleChange: exp.titleChange,
                    }}
                    userFromMonth={exp.userFromMonth}
                    userFromYear={exp.userFromYear}
                    userToMonth={exp.userToMonth}
                    userToYear={exp.userToYear}
                    userToPresent={exp.userToPresent}
                    dates={{
                      fromMonth: exp.fromMonth,
                      fromMonthStatus: exp.fromMonthStatus,
                      fromMonthChange: exp.fromMonthChange,
                      fromYear: exp.fromYear,
                      fromYearStatus: exp.fromYearStatus,
                      fromYearChange: exp.fromYearChange,
                      toMonth: exp.toMonth,
                      toMonthStatus: exp.toMonthStatus,
                      toMonthChange: exp.toMonthChange,
                      toYear: exp.toYear,
                      toYearStatus: exp.toYearStatus,
                      toYearChange: exp.toYearChange,
                      toPresent: exp.toPresent,
                    }}
                    userDescription={exp.job_description || ""}
                    description={{
                      descriptionInput: exp.descriptionInput,
                      descriptionStatus: exp.descriptionStatus,
                      descriptionChange: exp.descriptionChange,
                    }}
                    updateExperience={updateExperience}
                    removeExperienceFocusManagement={
                      removeExperienceFocusManagement
                    }
                    removeExperience={removeExperience}
                    isSubmitting={isSubmittingRef}
                  />
                </div>
              );
            })}
          </div>
          <Spacer axis="vertical" size="25" />
          <div className="button-container">
            <ControlButton
              type="submit"
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              buttonText={`${
                formStatus === FORM_STATUS.active ? "Submit" : ""
              }${formStatus === FORM_STATUS.loading ? "loading..." : ""}${
                formStatus === FORM_STATUS.success ? "Success!" : ""
              }${formStatus === FORM_STATUS.error ? "Re-Submit" : ""}`}
            />
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
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
    justify-items: stretch;
    align-items: start;
    grid-gap: 35px;
  }
`;

const FormSection = styled.section`
  .edit-info-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;
  }

  .error-summary {
    padding: 15px;
    border: 3px dashed red;
  }

  .form-container {
    .flex-container {
      display: flex;
      flex-direction: column;
      gap: 50px;
    }

    .add-button {
      width: 100%;
      max-width: 350px;
      .icon {
        height: 1rem;
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
    }
  }
`;

export default DashboardExperience;
