import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import Combobox from "../../../components/forms/combobox";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function AboutYou() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [skillsForReviewIdTracker, setSkillsForReviewIdTracker] = useState(1);

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

  let errorSummaryRef = React.createRef();
  let editInfoBtnRef = React.createRef();
  let summaryInputRef = React.createRef();

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
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        summaryInputRef.current.focus();
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

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);
    setSkillsForReviewIdTracker(1);

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
    if (user.summary === null && value.trim() === "") {
      setSummary({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.summary) {
      setSummary({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setSummary({ ...summary, inputChange: true, inputValue: value });
  }

  function validateSummaryInput(value) {
    if (!summary.inputChange) return;
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
      return [];
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

  function addLocation(locations) {
    const userLocationsObj = createObj(user.locations);
    const locationsToAdd = locations.filter(
      (location) => !(location.name in userLocationsObj)
    );

    setLocation({
      ...location,
      inputValue: locations,
      inputChange: true,
      locationsToAdd,
    });
  }

  function removeLocation(locations) {
    const locationsObj = createObj(locations);
    const locationsToRemove = user.locations.filter(
      (userLocation) => !(userLocation.name in locationsObj)
    );

    setLocation({
      ...location,
      inputValue: locations,
      inputChange: true,
      locationsToRemove,
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
      return [];
    }

    const results = res.data.filter(
      (prediction) => !(prediction.name in skillsObj)
    );

    return results;
  }

  function addTopSkill(skills) {
    const userSkillsObj = createObj(user.topSkills);
    const skillsToAdd = [];
    const skillsForReview = [];

    skills.forEach((skill) => {
      if (!(skill.name in userSkillsObj)) {
        if (Number.isInteger(skill.id)) {
          skillsToAdd.push(skill);
        } else {
          skillsForReview.push(skill);
        }
      }
    });

    const skillsForReviewCurrentId =
      skillsForReview.length + additionalSkills.skillsForReview.length + 1;

    setSkillsForReviewIdTracker(skillsForReviewCurrentId);
    setTopSkills({
      ...topSkills,
      inputValue: skills,
      inputChange: true,
      skillsToAdd,
      skillsForReview,
    });
  }

  function removeTopSkill(skills) {
    const skillsObj = createObj(skills);
    const skillsToRemove = user.topSkills.filter(
      (skill) => !(skill.name in skillsObj)
    );

    setTopSkills({
      ...topSkills,
      inputValue: skills,
      inputChange: true,
      skillsToRemove,
    });
  }

  function addAdditionalSkill(skills) {
    const userSkillsObj = createObj(user.additionalSkills);
    const skillsToAdd = [];
    const skillsForReview = [];

    skills.forEach((skill) => {
      if (!(skill.name in userSkillsObj)) {
        if (Number.isInteger(skill.id)) {
          skillsToAdd.push(skill);
        } else {
          skillsForReview.push(skill);
        }
      }
    });

    const skillsForReviewCurrentId =
      skillsForReview.length + topSkills.skillsForReview.length + 1;

    setSkillsForReviewIdTracker(skillsForReviewCurrentId);
    setAdditionalSkills({
      ...additionalSkills,
      inputValue: skills,
      inputChange: true,
      skillsToAdd,
      skillsForReview,
    });
  }

  function removeAdditionalSkill(skills) {
    const skillsObj = createObj(skills);
    const skillsToRemove = user.additionalSkills.filter(
      (skill) => !(skill.name in skillsObj)
    );

    setAdditionalSkills({
      ...additionalSkills,
      inputValue: skills,
      inputChange: true,
      skillsToRemove,
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

    if (summary.inputStatus === FORM_STATUS.error) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    if (
      !summary.inputChange &&
      !location.inputChange &&
      !topSkills.inputChange &&
      !additionalSkills.inputChange
    ) {
      return;
    }

    let additionalArr = [];

    if (summary.inputChange) {
      additionalArr.push({
        method: "PUT",
        url: `/users/${user.id}`,
        data: { summary: summary.inputValue },
      });
    }

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

    setFormStatus(FORM_STATUS.loading);
    await addUserExtras(additionalArr);
    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <>
        <Helmet>
          <title>Profile Dashboard About You • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">About You</h1>
        <section aria-labelledby="current-information-heading">
          <h2 id="current-information-heading">Current Information</h2>
          <button
            ref={editInfoBtnRef}
            id="edit-info-btn"
            data-main-content="true"
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusAction(e, FORM_STATUS.active)}
          >
            Edit Information
          </button>
          <ul aria-label="current information">
            <li>Summary: {user.summary || "None Set"}</li>
            <li>
              Interested Locations:
              {user.locations.length > 0 ? (
                <ul aria-label="interested locations">
                  {user.locations.map((location) => (
                    <li key={location.id}>{location.name}</li>
                  ))}
                </ul>
              ) : (
                "None Set"
              )}
            </li>
            <li>
              Top Skills:
              {user.topSkills.length > 0 ? (
                <ul aria-label="top skills">
                  {user.topSkills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              ) : (
                "None Set"
              )}
            </li>
            <li>
              Additional Skills:
              {user.additionalSkills.length > 0 ? (
                <ul aria-label="additional skills">
                  {user.additionalSkills.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              ) : (
                "None Set"
              )}
            </li>
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard About You • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">About You</h1>
      {formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="information updated"
          ariaId="success-form-announcer"
        />
      ) : null}

      <section aria-labelledby="edit-information-heading">
        <h2 id="edit-information-heading">Edit Information</h2>

        {formStatus === FORM_STATUS.error ? (
          <div ref={errorSummaryRef} tabIndex="-1">
            <h3 id="error-heading">Errors in Submission</h3>

            {summary.inputStatus === FORM_STATUS.error ? (
              <>
                <strong>
                  Please address the following errors and re-submit the form:
                </strong>
                <ul aria-label="current errors" id="error-group">
                  <li>
                    <a href="#summary">Summary Error</a>
                  </li>
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
        ) : null}

        <form onSubmit={(e) => submitEdit(e)}>
          <InputContainer>
            <label htmlFor="summary">Profile Summary:</label>
            <textarea
              ref={summaryInputRef}
              id="summary"
              data-main-content="true"
              name="profile-summary"
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
            {summary.inputStatus === FORM_STATUS.error ? (
              <span id="summary-error" className="err-mssg">
                Summary can only be alphabelical characters, numbers
              </span>
            ) : null}
            {summary.inputStatus === FORM_STATUS.success ? (
              <span id="summary-success" className="success-mssg">
                Summary is Validated
              </span>
            ) : null}
          </InputContainer>

          <Combobox
            chosenOptions={location.inputValue}
            onInputChange={getLocationsByValue}
            onChosenOption={addLocation}
            onRemoveChosenOption={removeLocation}
            inputName={"interested-locations"}
            displayName={"Interested Locations"}
          />

          <Combobox
            chosenOptions={topSkills.inputValue}
            onInputChange={getSkillsByValue}
            onChosenOption={addTopSkill}
            onRemoveChosenOption={removeTopSkill}
            inputName={"top-skills"}
            displayName={"Top Skills"}
          />

          <Combobox
            chosenOptions={additionalSkills.inputValue}
            onInputChange={getSkillsByValue}
            onChosenOption={addAdditionalSkill}
            onRemoveChosenOption={removeAdditionalSkill}
            inputName={"additional-skills"}
            displayName={"Additional Skills"}
          />

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
            onClick={resetForm}
            onKeyDown={(e) => formFocusAction(e, FORM_STATUS.idle)}
          >
            Cancel
          </button>
        </form>
      </section>
    </>
  );
}

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
