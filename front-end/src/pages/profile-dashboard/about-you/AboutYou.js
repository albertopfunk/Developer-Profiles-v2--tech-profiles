import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import Combobox from "../../../components/forms/combobox";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import {
  COMBOBOX_STATUS,
  FORM_STATUS,
} from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function AboutYou() {
  const { user, addUserExtras } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [announceFormStatus, setAnnounceFormStatus] = useState(false);
  const [announceLocationsChange, setAnnounceLocationsChange] = useState(false);

  const [summary, setSummary] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });

  const [locationStatus, setLocationStatus] = useState(COMBOBOX_STATUS.idle);
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
    skillsForReviewTracker: 0,
  });

  const [additionalSkills, setAdditionalSkills] = useState({
    inputValue: [],
    inputChange: false,
    skillsToAdd: [],
    skillsToRemove: [],
    skillsForReview: [],
    skillsForReviewTracker: 0,
  });

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

  useEffect(() => {
    const locationAnnouncementWait = setTimeout(() => {
      setAnnounceLocationsChange(true);
    }, 500);

    setAnnounceLocationsChange(false);

    return () => {
      clearTimeout(locationAnnouncementWait);
    };
  }, [locationStatus]);

  function onEditInputs() {
    setFormStatus(FORM_STATUS.active);
    setAnnounceFormStatus(true);

    setSummary({
      inputValue: user.summary || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });

    setLocationStatus(COMBOBOX_STATUS.idle);
    setAnnounceLocationsChange(false);
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
      skillsForReviewTracker: 0,
    });

    setAdditionalSkills({
      inputValue: user.additionalSkills,
      inputChange: false,
      skillsToAdd: [],
      skillsToRemove: [],
      skillsForReview: [],
      skillsForReviewTracker: 0,
    });
  }

  function onSummaryInputChange(value) {
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

  function onSummaryInputValidate(value) {
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

  async function getLocationsByValue(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return [];
    }

    if (location.inputValue.length > 0) {
      let checkDups = {};
      location.inputValue.forEach(
        (location) => (checkDups[location.name] = true)
      );

      const results = res.data.filter(
        (prediction) => !(prediction.name in checkDups)
      );

      return results;
    }

    return res.data;
  }

  function addLocation(locations) {
    let checkDups = {};
    user.locations.forEach((location) => (checkDups[location.name] = true));

    const locationsToAdd = locations.filter(
      (location) => !(location.name in checkDups)
    );

    setLocationStatus(COMBOBOX_STATUS.added);
    setLocation({
      ...location,
      inputValue: locations,
      inputChange: true,
      locationsToAdd,
    });
  }

  function removeLocation(locations) {
    let checkDups = {};
    locations.forEach((location) => (checkDups[location.name] = true));

    const locationsToRemove = user.locations.filter(
      (location) => !(location.name in checkDups)
    );

    setLocationStatus(COMBOBOX_STATUS.removed);
    setLocation({
      ...location,
      inputValue: locations,
      inputChange: true,
      locationsToRemove,
    });
  }

  function onLocationsSubmit() {
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

  async function onTopSkillInputChange(value) {
    let skillsObj = {};

    topSkills.inputValue.forEach((skill) => (skillsObj[skill.name] = true));

    const [res, err] = await httpClient("POST", "/skills/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      if (res.err === "Zero results found" && !(value in skillsObj)) {
        return [{ name: value, id: `new-${topSkills.skillsForReviewTracker}` }];
      }
      return [];
    }

    const results = res.data.filter(
      (prediction) => !(prediction.name in skillsObj)
    );

    return results;
  }

  async function onAdditionalSkillInputChange(value) {
    let skillsObj = {};

    additionalSkills.inputValue.forEach(
      (skill) => (skillsObj[skill.name] = true)
    );

    const [res, err] = await httpClient("POST", "/skills/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      if (res.err === "Zero results found" && !(value in skillsObj)) {
        return [
          {
            name: value,
            id: `new-${additionalSkills.skillsForReviewTracker}`,
          },
        ];
      }
      return [];
    }

    const results = res.data.filter(
      (prediction) => !(prediction.name in skillsObj)
    );

    return results;
  }

  // seperate, skills to add, remove, review
  function onSkillsSubmit(type) {
    let skillsToAdd = [];
    let skillsToRemove = [];
    let requests = [];

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
    return requests;
  }

  function addTopSkill(skills) {
    let checkDups = {};
    user.topSkills.forEach((skill) => (checkDups[skill.name] = true));

    const skillsToAdd = skills.filter((skill) => !(skill.name in checkDups));
    const skillsForReview = skillsToAdd.filter(
      (skill) => !Number.isInteger(skill.id)
    );

    setTopSkills({
      ...topSkills,
      inputValue: skills,
      inputChange: true,
      skillsToAdd,
      skillsForReview,
      skillsForReviewTracker: skillsForReview.length + 1,
    });
  }

  function removeTopSkill(skills) {
    let checkDups = {};
    skills.forEach((skill) => (checkDups[skill.name] = true));

    const skillsToRemove = user.topSkills.filter(
      (skill) => !(skill.name in checkDups)
    );

    setTopSkills({
      ...topSkills,
      inputValue: skills,
      inputChange: true,
      skillsToRemove,
    });
  }

  function addAdditionalSkill(skills) {
    let checkDups = {};
    user.additionalSkills.forEach((skill) => (checkDups[skill.name] = true));

    const skillsToAdd = skills.filter((skill) => !(skill.name in checkDups));
    const skillsForReview = skillsToAdd.filter(
      (skill) => !Number.isInteger(skill.id)
    );

    setAdditionalSkills({
      ...additionalSkills,
      inputValue: skills,
      inputChange: true,
      skillsToAdd,
      skillsForReview,
      skillsForReviewTracker: skillsForReview.length + 1,
    });
  }

  function removeAdditionalSkill(skills) {
    let checkDups = {};
    skills.forEach((skill) => (checkDups[skill.name] = true));

    const skillsToRemove = user.additionalSkills.filter(
      (skill) => !(skill.name in checkDups)
    );

    setAdditionalSkills({
      ...additionalSkills,
      inputValue: skills,
      inputChange: true,
      skillsToRemove,
    });
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
      let locationRequests = onLocationsSubmit();
      additionalArr = [...additionalArr, ...locationRequests];
    }

    if (topSkills.inputChange) {
      let locationRequests = onSkillsSubmit("top");
      additionalArr = [...additionalArr, ...locationRequests];
    }

    if (additionalSkills.inputChange) {
      let locationRequests = onSkillsSubmit("additional");
      additionalArr = [...additionalArr, ...locationRequests];
    }

    setFormStatus(FORM_STATUS.loading);
    await addUserExtras(additionalArr);
    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  console.log("--- About You ---");

  if (formStatus === FORM_STATUS.idle) {
    return (
      <div>
        <h1>Edit Inputs</h1>
        <button onClick={onEditInputs}>Edit</button>
      </div>
    );
  }

  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Dashboard About You • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">About You</h1>

      {announceFormStatus && formStatus === FORM_STATUS.active ? (
        <Announcer
          announcement="Form is active, inputs are validated but not required"
          ariaId="active-form-announcer"
        />
      ) : null}

      {announceFormStatus && formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="information updated"
          ariaId="success-form-announcer"
        />
      ) : null}

      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions"
      >
        {announceLocationsChange && locationStatus === COMBOBOX_STATUS.added
          ? "added location"
          : null}
        {announceLocationsChange && locationStatus === COMBOBOX_STATUS.removed
          ? "removed location"
          : null}
      </div>

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
              id="summary"
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
              onChange={(e) => onSummaryInputChange(e.target.value)}
              onBlur={(e) => onSummaryInputValidate(e.target.value)}
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
            onInputChange={onTopSkillInputChange}
            onChosenOption={addTopSkill}
            onRemoveChosenOption={removeTopSkill}
            inputName={"top-skills"}
            displayName={"Top Skills"}
          />

          <Combobox
            chosenOptions={additionalSkills.inputValue}
            onInputChange={onAdditionalSkillInputChange}
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
            onClick={() => setFormStatus(FORM_STATUS.idle)}
          >
            Cancel
          </button>
        </form>
      </section>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
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
