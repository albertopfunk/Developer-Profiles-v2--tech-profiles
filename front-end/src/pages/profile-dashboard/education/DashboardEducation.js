import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";
import { ReactComponent as AddIcon } from "../../../global/assets/dashboard-add.svg";

import EducationForm from "../../../components/forms/user-extras/EducationForm";
import ControlButton from "../../../components/forms/buttons/ControlButton";
import IconButton from "../../../components/forms/buttons/IconButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import useCurrentYear from "../../../global/helpers/hooks/useCurrentYear";
import { ERROR_MESSAGE, FORM_STATUS } from "../../../global/helpers/variables";
import { validateInput } from "../../../global/helpers/validation";
import useToggle from "../../../global/helpers/hooks/useToggle";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

let formSuccessWait;
function DashboardEducation() {
  const { user, addUserExtras } = useContext(ProfileContext);

  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [formFocusToggle, setFormFocusToggle] = useToggle();
  const [hasSubmitError, setHasSubmitError] = useState(null);

  const [education, setEducation] = useState([]);
  const [educationChange, setEducationChange] = useState(false);
  const [newEducationId, setNewEducationId] = useState(1);
  const [removedEducationIndex, setRemovedEducationIndex] = useState(null);
  const [
    removeEducationFocusToggle,
    setRemoveEducationFocusToggle,
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

  // remove education focus management
  useEffect(() => {
    if (removedEducationIndex === null) {
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

    if (removeBtnRefs.current[removedEducationIndex]) {
      removeBtnRefs.current[removedEducationIndex].current.focus();
    } else {
      removeBtnRefs.current[removedEducationIndex - 1].current.focus();
    }
  }, [removeEducationFocusToggle]);

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

    const updatedUserEducation = user.education.map((edu) => {
      const datesObj = splitDates(edu.school_dates);

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

    setEducation(updatedUserEducation);
    setEducationChange(false);
    setNewEducationId(1);
    setRemovedEducationIndex(null);
    removeBtnRefs.current = updatedUserEducation.map(() => React.createRef());
  }

  function updateEducation(index, state, checkChanges = false) {
    const newEduArr = [...education];
    const newEduObj = { ...newEduArr[index], ...state };
    newEduArr.splice(index, 1, newEduObj);
    setEducation(newEduArr);

    if (checkChanges) {
      const userEduChange = newEduArr.filter(
        (edu) =>
          Number.isInteger(edu.id) &&
          (edu.schoolChange ||
            edu.fieldOfStudyChange ||
            edu.descriptionChange ||
            edu.fromMonthChange ||
            edu.fromYearChange ||
            edu.toMonthChange ||
            edu.toYearChange)
      );

      // set form back to active if no changes
      if (userEduChange.length === 0 && !educationChange) {
        setFormStatus(FORM_STATUS.active);
      }
    }
  }

  function addEducation(e) {
    e.preventDefault();

    const currentEducation = [
      ...education,

      {
        id: `new-${newEducationId}`,

        schoolNameInput: "",
        schoolStatus: FORM_STATUS.idle,
        schoolChange: false,

        fieldOfStudyInput: "",
        fieldOfStudyStatus: FORM_STATUS.idle,
        fieldOfStudyChange: false,

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

    removeBtnRefs.current = currentEducation.map(() => React.createRef());
    setEducation(currentEducation);
    setNewEducationId(newEducationId + 1);
    setEducationChange(true);
  }

  function removeEducationFocusManagement(e, eduIndex) {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    removeEducation(eduIndex);
    setRemoveEducationFocusToggle();
  }

  function removeEducation(eduIndex) {
    const newEducation = [...education];
    newEducation.splice(eduIndex, 1);
    removeBtnRefs.current = newEducation.map(() => React.createRef());
    setEducation(newEducation);
    setRemovedEducationIndex(eduIndex);
    setEducationChanges(newEducation);
  }

  function setEducationChanges(education) {
    let savedEducation = [];
    let newEducation = [];

    education.forEach((edu) => {
      if (Number.isInteger(edu.id)) {
        savedEducation.push(edu);
      } else {
        newEducation.push(edu);
      }
    });

    if (
      newEducation.length > 0 ||
      savedEducation.length !== user.education.length
    ) {
      setEducationChange(true);
      return;
    }

    // checking input changes if no education change
    const savedEducationChange = savedEducation.filter(
      (edu) =>
        edu.schoolChange ||
        edu.fieldOfStudyChange ||
        edu.descriptionChange ||
        edu.fromMonthChange ||
        edu.fromYearChange ||
        edu.toMonthChange ||
        edu.toYearChange
    );

    // set form back to active if no changes
    if (savedEducationChange.length === 0) {
      setFormStatus(FORM_STATUS.active);
    }

    setEducationChange(false);
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
        edu.fromMonth === "" ||
        edu.fromYear === ""
      ) {
        isErrors = true;
      }

      if (edu.toPresent === "" && (edu.toMonth === "" || edu.toYear === "")) {
        isErrors = true;
      }

      return isErrors;
    });
  }

  function addNewEducation() {
    const requests = [];

    education.forEach((edu) => {
      if (!Number.isInteger(edu.id)) {
        const fromDates = `${edu.fromMonth} ${edu.fromYear}`;
        const toDates = edu.toPresent
          ? "Present"
          : `${edu.toMonth} ${edu.toYear}`;
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
          edu.fromMonthChange ||
          edu.fromYearChange ||
          edu.toMonthChange ||
          edu.toYearChange
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

          if (
            edu.fromMonthChange ||
            edu.fromYearChange ||
            edu.toMonthChange ||
            edu.toYearChange
          ) {
            const fromDates = `${edu.fromMonth} ${edu.fromYear}`;
            const toDates = edu.toPresent
              ? "Present"
              : `${edu.toMonth} ${edu.toYear}`;
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

    // check for changes
    const userEduChange = education.filter(
      (edu) =>
        Number.isInteger(edu.id) &&
        (edu.schoolChange ||
          edu.fieldOfStudyChange ||
          edu.descriptionChange ||
          edu.fromMonthChange ||
          edu.fromYearChange ||
          edu.toMonthChange ||
          edu.toYearChange)
    );

    if (userEduChange.length === 0 && !educationChange) {
      return;
    }

    // set loading
    setFormStatus(FORM_STATUS.loading);
    isSubmittingRef.current = true;

    // validate education
    const currentEducation = [...education];
    let areThereErrors = false;

    education.forEach((edu, eduIndex) => {
      const newState = {};

      if (edu.schoolChange || edu.schoolNameInput.trim() === "") {
        if (edu.schoolNameInput.trim() === "") {
          areThereErrors = true;
          newState.schoolNameInput = "";
          newState.schoolStatus = FORM_STATUS.error;
        } else if (validateInput("title", edu.schoolNameInput)) {
          newState.schoolStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.schoolStatus = FORM_STATUS.error;
        }
      }

      if (edu.fieldOfStudyChange || edu.fieldOfStudyInput.trim() === "") {
        if (edu.fieldOfStudyInput.trim() === "") {
          areThereErrors = true;
          newState.fieldOfStudyInput = "";
          newState.fieldOfStudyStatus = FORM_STATUS.error;
        } else if (validateInput("title", edu.fieldOfStudyInput)) {
          newState.fieldOfStudyStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.fieldOfStudyStatus = FORM_STATUS.error;
        }
      }

      if (edu.descriptionChange || edu.descriptionInput.trim() === "") {
        if (edu.descriptionInput.trim() === "") {
          areThereErrors = true;
          newState.descriptionInput = "";
          newState.descriptionStatus = FORM_STATUS.error;
        } else if (validateInput("summary", edu.descriptionInput)) {
          newState.descriptionStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.descriptionStatus = FORM_STATUS.error;
        }
      }

      if (edu.fromMonthChange || !edu.fromMonth) {
        if (!edu.fromMonth) {
          areThereErrors = true;
          newState.fromMonthStatus = FORM_STATUS.error;
        } else {
          newState.fromMonthStatus = FORM_STATUS.success;
        }
      }

      if (edu.fromYearChange || !edu.fromYear) {
        if (!edu.fromMonth) {
          areThereErrors = true;
          newState.fromYearStatus = FORM_STATUS.error;
        } else {
          newState.fromYearStatus = FORM_STATUS.success;
        }
      }

      if (!edu.toPresent) {
        if (edu.toMonthChange || !edu.toMonth) {
          if (!edu.toMonth) {
            areThereErrors = true;
            newState.toMonthStatus = FORM_STATUS.error;
          } else {
            newState.toMonthStatus = FORM_STATUS.success;
          }
        }

        if (edu.toYearChange || !edu.toYear) {
          if (!edu.toYear) {
            areThereErrors = true;
            newState.toYearStatus = FORM_STATUS.error;
          } else {
            newState.toYearStatus = FORM_STATUS.success;
          }
        }
      }

      currentEducation.splice(eduIndex, 1, {
        ...currentEducation[eduIndex],
        ...newState,
      });
    });

    setEducation(currentEducation);

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

    if (educationChange) {
      const newEduRequests = addNewEducation();
      const removeEduRequests = removeUserEducation();
      requests = [...newEduRequests, ...removeEduRequests];
    }

    if (userEduChange.length > 0) {
      const updatedEduRequests = updateUserEducation();
      requests = [...requests, ...updatedEduRequests];
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
            size="lg"
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
      <div className="edit-info-header">
        <h2 id="edit-information-heading">Edit Info</h2>
        <IconButton
          ref={resetBtnRef}
          type="reset"
          size="lg"
          disabled={
            formStatus === FORM_STATUS.loading ||
            formStatus === FORM_STATUS.success
          }
          ariaLabel="cancel"
          icon={<CloseIcon className="icon" />}
          attributes={{
            form: "education-form",
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
                formErrors.map((edu, index) => (
                  <div key={edu.id}>
                    {index !== 0 ? <Spacer axis="vertical" size="15" /> : null}
                    <div>
                      <h4>{`Current "${
                        edu.schoolNameInput || "New Education"
                      }" Errors`}</h4>
                      <Spacer axis="vertical" size="10" />
                      <ul
                        aria-label={`current ${
                          edu.schoolNameInput || "new education"
                        } errors`}
                      >
                        {edu.schoolNameInput.trim() === "" ||
                        edu.schoolStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#school-${edu.id}`}>
                              School Name Error:{" "}
                            </a>
                            {ERROR_MESSAGE.nameLong} {ERROR_MESSAGE.required}
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="10" />
                        {edu.fieldOfStudyInput.trim() === "" ||
                        edu.fieldOfStudyStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#field-of-study-${edu.id}`}>
                              Field of Study Error:{" "}
                            </a>
                            {ERROR_MESSAGE.titleLong} {ERROR_MESSAGE.required}
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="10" />
                        {edu.fromMonth === "" ? (
                          <li>
                            <a href={`#from-month-${edu.id}`}>
                              From Month Error:{" "}
                            </a>
                            {ERROR_MESSAGE.required}
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="10" />
                        {edu.fromYear === "" ? (
                          <li>
                            <a href={`#from-year-${edu.id}`}>
                              From Year Error:{" "}
                            </a>
                            {ERROR_MESSAGE.required}
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="10" />
                        {!edu.toPresent && edu.toMonth === "" ? (
                          <li>
                            <a href={`#to-month-${edu.id}`}>To Month Error: </a>
                            {ERROR_MESSAGE.required}
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="10" />
                        {!edu.toPresent && edu.toYear === "" ? (
                          <li>
                            <a href={`#to-year-${edu.id}`}>To Year Error: </a>
                            {ERROR_MESSAGE.required}
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="10" />
                        {edu.descriptionInput.trim() === "" ||
                        edu.descriptionStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#description-${edu.id}`}>
                              Description Error:{" "}
                            </a>
                            {ERROR_MESSAGE.summaryLong} {ERROR_MESSAGE.required}
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
          onClick={(e) => addEducation(e)}
          classNames="add-button"
          buttonText="new education"
          ariaLabel="add"
          endIcon={<AddIcon className="icon" />}
          attributes={{
            id: "add-new-btn",
            form: "education-form",
          }}
        />
        <Spacer axis="vertical" size="20" />
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
                    school={{
                      schoolNameInput: edu.schoolNameInput,
                      schoolStatus: edu.schoolStatus,
                      schoolChange: edu.schoolChange,
                    }}
                    userFieldOfStudy={edu.field_of_study || ""}
                    fieldOfStudy={{
                      fieldOfStudyInput: edu.fieldOfStudyInput,
                      fieldOfStudyStatus: edu.fieldOfStudyStatus,
                      fieldOfStudyChange: edu.fieldOfStudyChange,
                    }}
                    userFromMonth={edu.userFromMonth}
                    userFromYear={edu.userFromYear}
                    userToMonth={edu.userToMonth}
                    userToYear={edu.userToYear}
                    userToPresent={edu.userToPresent}
                    dates={{
                      fromMonth: edu.fromMonth,
                      fromMonthStatus: edu.fromMonthStatus,
                      fromMonthChange: edu.fromMonthChange,
                      fromYear: edu.fromYear,
                      fromYearStatus: edu.fromYearStatus,
                      fromYearChange: edu.fromYearChange,
                      toMonth: edu.toMonth,
                      toMonthStatus: edu.toMonthStatus,
                      toMonthChange: edu.toMonthChange,
                      toYear: edu.toYear,
                      toYearStatus: edu.toYearStatus,
                      toYearChange: edu.toYearChange,
                      toPresent: edu.toPresent,
                    }}
                    userDescription={edu.education_description || ""}
                    description={{
                      descriptionInput: edu.descriptionInput,
                      descriptionStatus: edu.descriptionStatus,
                      descriptionChange: edu.descriptionChange,
                    }}
                    updateEducation={updateEducation}
                    removeEducationFocusManagement={
                      removeEducationFocusManagement
                    }
                    removeEducation={removeEducation}
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
        fill: var(--lighter-cyan-2);
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

export default DashboardEducation;
