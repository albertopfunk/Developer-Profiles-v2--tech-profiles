import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";

import Combobox from "../../../components/forms/combobox";
import ControlButton from "../../../components/forms/buttons/ControlButton";
import IconButton from "../../../components/forms/buttons/IconButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { ERROR_MESSAGE, FORM_STATUS } from "../../../global/helpers/variables";
import useToggle from "../../../global/helpers/hooks/useToggle";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

let formSuccessWait;
function AboutYou() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [formFocusToggle, setFormFocusToggle] = useToggle();
  const [hasSubmitError, setHasSubmitError] = useState(null);

  const [summary, setSummary] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [location, setLocation] = useState({
    inputValue: [],
    inputChange: false,
    locationsToAdd: [],
    locationsToRemove: [],
  });
  const [skillsForReviewIdTracker, setSkillsForReviewIdTracker] = useState(1);
  const [topSkills, setTopSkills] = useState({
    inputValue: [],
    inputChange: false,
    skillsToAdd: [],
    skillsToRemove: [],
    skillsForReview: [],
  });
  const [additionalSkills, setAdditionalSkills] = useState({
    inputValue: [],
    inputChange: false,
    skillsToAdd: [],
    skillsToRemove: [],
    skillsForReview: [],
  });

  const [checkChangesToggle, setCheckChangesToggle] = useToggle();

  let isSubmittingRef = useRef(false);
  const errorSummaryRef = React.createRef();
  const editInfoBtnRef = React.createRef();
  const resetBtnRef = React.createRef();

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

  // resets form status if no changes
  useEffect(() => {
    if (formStatus !== FORM_STATUS.error) {
      return;
    }

    if (
      !summary.inputChange &&
      !location.inputChange &&
      !topSkills.inputChange &&
      !additionalSkills.inputChange
    ) {
      setFormStatus(FORM_STATUS.active);
    }
  }, [checkChangesToggle]);

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

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);
    setFormFocusStatus(FORM_STATUS.active);
    setHasSubmitError(null);

    setSummary({
      inputValue: user.summary || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setLocation({
      inputValue: user.locations,
      inputChange: false,
      locationsToAdd: [],
      locationsToRemove: [],
    });
    setSkillsForReviewIdTracker(1);
    setTopSkills({
      inputValue: user.topSkills,
      inputChange: false,
      skillsToAdd: [],
      skillsToRemove: [],
      skillsForReview: [],
    });
    setAdditionalSkills({
      inputValue: user.additionalSkills,
      inputChange: false,
      skillsToAdd: [],
      skillsToRemove: [],
      skillsForReview: [],
    });
  }

  function setSummaryInput(value) {
    if (!user.summary && value.trim() === "") {
      setSummary({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.summary) {
      setSummary({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setSummary({ ...summary, inputChange: true, inputValue: value });
  }

  function validateSummaryInput(value) {
    if (!summary.inputChange) return;
    if (isSubmittingRef.current) return;
    if (value.trim() === "") {
      setSummary({
        ...summary,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("summary", value)) {
      setSummary({ ...summary, inputStatus: FORM_STATUS.success });
    } else {
      setSummary({ ...summary, inputStatus: FORM_STATUS.error });
    }
  }

  function createObj(objArr) {
    const newObj = {};
    objArr.forEach((item) => (newObj[item.name] = true));
    return newObj;
  }

  async function getLocationsByValue(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      if (res.err === "Zero results found") return [];
      return { error: "Error getting location results" };
    }

    if (location.inputValue.length > 0) {
      const locationsObj = createObj(location.inputValue);
      const filteredData = res.data.filter(
        (prediction) => !(prediction.name in locationsObj)
      );

      return filteredData;
    }

    return res.data;
  }

  function setLocations(locations) {
    const userLocationsObj = createObj(user.locations);
    const locationsToAdd = locations.filter(
      (location) => !(location.name in userLocationsObj)
    );

    const locationsObj = createObj(locations);
    const locationsToRemove = user.locations.filter(
      (userLocation) => !(userLocation.name in locationsObj)
    );

    let inputChange;
    if (locationsToAdd.length === 0 && locationsToRemove.length === 0) {
      inputChange = false;
      setCheckChangesToggle();
    } else {
      inputChange = true;
    }

    setLocation({
      inputValue: locations,
      locationsToAdd,
      locationsToRemove,
      inputChange,
    });
  }

  function setUpLocationRequests() {
    let requests = [];

    if (location.locationsToAdd.length > 0) {
      requests.push({
        method: "POST",
        url: `/locations/new`,
        data: { locations: location.locationsToAdd, user_id: user.id },
      });
    }

    if (location.locationsToRemove.length > 0) {
      location.locationsToRemove.forEach((location) => {
        requests.push({
          method: "POST",
          url: `/locations/delete-user-location`,
          data: { location_id: location.id, user_id: user.id },
        });
      });
    }

    return requests;
  }

  async function getSkillsByValue(value) {
    const tSkillsObj = createObj(topSkills.inputValue);
    const aSkillsObj = createObj(additionalSkills.inputValue);
    const skillsObj = { ...tSkillsObj, ...aSkillsObj };

    const [res, err] = await httpClient("POST", "/skills/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      if (res.err === "Zero results found" && !(value in skillsObj)) {
        return [{ name: value, id: `new-${skillsForReviewIdTracker}` }];
      }
      return { error: "Error getting skill results" };
    }

    const results = res.data.filter(
      (prediction) => !(prediction.name in skillsObj)
    );

    return results;
  }

  function setSkills(skills, userSkills) {
    const userSkillsObj = createObj(userSkills);
    const skillsToAdd = [];
    const skillsForReview = [];
    let skillsForReviewLen = skillsForReviewIdTracker;

    skills.forEach((skill) => {
      if (!(skill.name in userSkillsObj)) {
        if (Number.isInteger(skill.id)) {
          skillsToAdd.push(skill);
        } else {
          // TODO:
          // check if user has skill saved
          skillsForReview.push(skill);
          skillsForReviewLen++;
        }
      }
    });

    const skillsObj = createObj(skills);
    const skillsToRemove = userSkills.filter(
      (skill) => !(skill.name in skillsObj)
    );

    let inputChange;
    if (
      skillsToAdd.length > 0 ||
      skillsToRemove.length > 0 ||
      skillsForReview.length > 0
    ) {
      inputChange = true;
    } else {
      inputChange = false;
      setCheckChangesToggle();
    }

    return {
      skillsToAdd,
      skillsForReview,
      skillsForReviewLen,
      skillsToRemove,
      inputChange,
    };
  }

  function updateSkill(skills, type) {
    let userSkills;
    let skillsStateFn;
    if (type === "top") {
      userSkills = user.topSkills;
      skillsStateFn = setTopSkills;
    } else {
      userSkills = user.additionalSkills;
      skillsStateFn = setAdditionalSkills;
    }

    const {
      skillsToAdd,
      skillsForReview,
      skillsForReviewLen,
      skillsToRemove,
      inputChange,
    } = setSkills(skills, userSkills);

    setSkillsForReviewIdTracker(skillsForReviewIdTracker + skillsForReviewLen);
    skillsStateFn({
      inputValue: skills,
      skillsToAdd,
      skillsForReview,
      skillsToRemove,
      inputChange,
    });
  }

  function setUpSkillRequests(type) {
    let requests = [];
    let skillsToAdd;
    let skillsToRemove;
    let skillsForReview;

    if (type === "user_top_skills") {
      skillsToAdd = [...topSkills.skillsToAdd];
      skillsToRemove = [...topSkills.skillsToRemove];
      skillsForReview = [...topSkills.skillsForReview];
    } else {
      skillsToAdd = [...additionalSkills.skillsToAdd];
      skillsToRemove = [...additionalSkills.skillsToRemove];
      skillsForReview = [...additionalSkills.skillsForReview];
    }

    if (skillsToAdd.length > 0) {
      requests.push({
        method: "POST",
        url: `/skills/new-user-skill`,
        data: {
          skills: skillsToAdd,
          user_id: user.id,
          type,
        },
      });
    }

    if (skillsToRemove.length > 0) {
      skillsToRemove.forEach((skill) => {
        requests.push({
          method: "POST",
          url: `/skills/delete-user-skill`,
          data: {
            skill_id: skill.id,
            user_id: user.id,
            type,
          },
        });
      });
    }

    if (skillsForReview.length > 0) {
      skillsForReview.forEach((skill) => {
        requests.push({
          method: "POST",
          url: `/skills-for-review/new`,
          data: {
            skill_for_review: skill.name,
            user_id: user.id,
            type,
          },
        });
      });
    }

    return requests;
  }

  async function submitEdit(e) {
    e.preventDefault();

    // check for changes
    if (
      !summary.inputChange &&
      !location.inputChange &&
      !topSkills.inputChange &&
      !additionalSkills.inputChange
    ) {
      return;
    }

    // set loading
    setFormStatus(FORM_STATUS.loading);
    isSubmittingRef.current = true;

    // validate and set up requests
    let areThereErrors = false;
    let additionalArr = [];

    if (summary.inputChange) {
      if (summary.inputValue.trim() === "") {
        additionalArr.push({
          method: "PUT",
          url: `/users/${user.id}`,
          data: { summary: "" },
        });
        setSummary({
          ...summary,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("summary", summary.inputValue)) {
        additionalArr.push({
          method: "PUT",
          url: `/users/${user.id}`,
          data: { summary: summary.inputValue },
        });
        setSummary({ ...summary, inputStatus: FORM_STATUS.success });
      } else {
        areThereErrors = true;
        setSummary({ ...summary, inputStatus: FORM_STATUS.error });
      }
    }

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

    // continue setting up requests
    if (location.inputChange) {
      const locationRequests = setUpLocationRequests();
      additionalArr = [...additionalArr, ...locationRequests];
    }

    if (topSkills.inputChange) {
      const skillRequests = setUpSkillRequests("user_top_skills");
      additionalArr = [...additionalArr, ...skillRequests];
    }

    if (additionalSkills.inputChange) {
      const skillRequests = setUpSkillRequests("user_additional_skills");
      additionalArr = [...additionalArr, ...skillRequests];
    }

    // submit
    const results = await addUserExtras(additionalArr);

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
        <dl className="info-group" aria-label="current information">
          <div className="flex-row">
            <div className="flex-col">
              <div>
                <dt>Summary:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.summary || "None Set"}</dd>
              </div>
              <div>
                <dt>Interested Locations:</dt>
                <Spacer axis="vertical" size="5" />
                {user.locations.length > 0 ? (
                  user.locations.map((location) => (
                    <dd key={location.id}>{location.name}</dd>
                  ))
                ) : (
                  <dd>None Set</dd>
                )}
              </div>
            </div>
            <div className="flex-col">
              <div>
                <dt>Top Skills:</dt>
                <Spacer axis="vertical" size="5" />
                {user.topSkills.length > 0 ? (
                  user.topSkills.map((skill) => (
                    <dd key={skill.id}>{skill.name}</dd>
                  ))
                ) : (
                  <dd>None Set</dd>
                )}
              </div>
              <div>
                <dt>Additional Skills:</dt>
                <Spacer axis="vertical" size="5" />
                {user.additionalSkills.length > 0 ? (
                  user.additionalSkills.map((skill) => (
                    <dd key={skill.id}>{skill.name}</dd>
                  ))
                ) : (
                  <dd>None Set</dd>
                )}
              </div>
            </div>
          </div>
        </dl>
      </InfoSection>
    );
  }

  return (
    <>
      {formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="information updated"
          ariaId="success-form-announcer"
        />
      ) : null}

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
              form: "submit-form",
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
              {hasSubmitError || summary.inputStatus === FORM_STATUS.error ? (
                <>
                  <strong>
                    Please address the following errors and re-submit the form:
                  </strong>
                  <Spacer axis="vertical" size="10" />
                  <ul aria-label="current errors" id="error-group">
                    {hasSubmitError ? (
                      <li>Error submitting form, please try again</li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
                    {summary.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#summary">Summary Error: </a>
                        {ERROR_MESSAGE.summaryLong}
                      </li>
                    ) : null}
                  </ul>
                </>
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
            </div>
          </>
        ) : null}
        <Spacer axis="vertical" size="30" />
        <form id="submit-form" onSubmit={(e) => submitEdit(e)}>
          <InputContainer>
            <label htmlFor="summary">Profile Summary:</label>
            <Spacer axis="vertical" size="5" />
            <textarea
              id="summary"
              name="profile-summary"
              data-input
              maxLength="280"
              cols="8"
              rows="5"
              className={`input ${
                summary.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="summary-error summary-success"
              aria-invalid={summary.inputStatus === FORM_STATUS.error}
              value={summary.inputValue}
              onChange={(e) => setSummaryInput(e.target.value)}
              onBlur={(e) => validateSummaryInput(e.target.value)}
            />
            <Spacer axis="vertical" size="5" />
            {summary.inputStatus === FORM_STATUS.error ? (
              <span id="summary-error" className="err-mssg">
                {ERROR_MESSAGE.summaryShort}
              </span>
            ) : null}
            {summary.inputStatus === FORM_STATUS.success ? (
              <span id="summary-success" className="success-mssg">
                Summary is Validated
              </span>
            ) : null}
          </InputContainer>
          <Spacer axis="vertical" size="20" />
          <Combobox
            chosenOptions={location.inputValue}
            onInputChange={getLocationsByValue}
            onChosenOption={setLocations}
            onRemoveChosenOption={setLocations}
            inputName={"interested-locations"}
            displayName={"Interested Locations"}
          />
          <Spacer axis="vertical" size="20" />
          <Combobox
            chosenOptions={topSkills.inputValue}
            onInputChange={getSkillsByValue}
            onChosenOption={(skills) => updateSkill(skills, "top")}
            onRemoveChosenOption={(skills) => updateSkill(skills, "top")}
            inputName={"top-skills"}
            displayName={"Top Skills"}
          />
          <Spacer axis="vertical" size="20" />
          <Combobox
            chosenOptions={additionalSkills.inputValue}
            onInputChange={getSkillsByValue}
            onChosenOption={(skills) => updateSkill(skills, "additional")}
            onRemoveChosenOption={(skills) => updateSkill(skills, "additional")}
            inputName={"additional-skills"}
            displayName={"Additional Skills"}
          />
          <Spacer axis="vertical" size="20" />
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
      </FormSection>
    </>
  );
}

const InfoSection = styled.section`
  .info-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;
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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  .input-err {
    border: solid red;
  }
  .err-mssg {
    color: red;
    font-size: 0.7rem;
  }
  .success-mssg {
    color: green;
    font-size: 0.7rem;
  }
`;

export default AboutYou;
