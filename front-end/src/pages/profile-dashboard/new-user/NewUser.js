import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as WelcomeIntro } from "../../../global/assets/dashboard-intro.svg";
import styled from "styled-components";

import ImageBox from "../../../components/forms/images/imageBox";
import CheckoutContainer from "../../../components/forms/billing";
import Combobox from "../../../components/forms/combobox";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function NewUser() {
  const { user, editProfile, userImage } = useContext(ProfileContext);
  const [selectedTab, setSelectedTab] = useState("basic-info");
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [hasSubmitError, setHasSubmitError] = useState(null);
  let history = useHistory();

  const [firstName, setFirstName] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });

  const [imageChange, setImageChange] = useState(false);

  const [areaOfWork, setAreaOfWork] = useState({
    inputValue: "",
    inputChange: false,
  });
  const [title, setTitle] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [summary, setSummary] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [location, setLocation] = useState([]);
  const [locationChange, setLocationChange] = useState(false);

  let errorSummaryRef = React.createRef();
  let editInfoBtnRef = React.createRef();
  let basicInfoTabRef = React.createRef();
  let basicInfoPanelRef = React.createRef();
  let billingInfoTabRef = React.createRef();
  let billingInfoPanelRef = React.createRef();

  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  useEffect(() => {
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        basicInfoTabRef.current.focus();
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

    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setAreaOfWork({
      inputValue: "",
      inputChange: false,
    });
    setTitle({
      inputValue: user.desired_title || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setSummary({
      inputValue: user.summary || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });

    if (user.current_location_name) {
      setLocation([
        {
          name: user.current_location_name,
          id: 1, // combobox requires id for key
          lat: user.current_location_lat,
          lon: user.current_location_lon,
        },
      ]);
    } else {
      setLocation([]);
    }
    setLocationChange(false);
  }

  function changeTab(tab, e = null) {
    e && e.preventDefault();
    setSelectedTab(tab);
  }

  function tabActions(e) {
    // left/right arrow keys
    if (e.keyCode === 37 || e.keyCode === 39) {
      e.preventDefault();
      if (e.target.id === "basic-info") {
        changeTab("billing-info");
        billingInfoTabRef.current.focus();
      } else {
        changeTab("basic-info");
        basicInfoTabRef.current.focus();
      }
    }

    // down arrow
    if (e.keyCode === 40) {
      e.preventDefault();
      if (e.target.id === "basic-info") {
        basicInfoPanelRef.current.focus();
      } else {
        billingInfoPanelRef.current.focus();
      }
    }

    // enter and space
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
    }

    // home
    if (e.keyCode === 36) {
      e.preventDefault();
      changeTab("basic-info");
      basicInfoTabRef.current.focus();
    }

    // end
    if (e.keyCode === 35) {
      e.preventDefault();
      changeTab("billing-info");
      billingInfoTabRef.current.focus();
    }
  }

  function setFirstNameInput(value) {
    if (user.first_name === null && value.trim() === "") {
      setFirstName({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.first_name) {
      setFirstName({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setFirstName({ ...firstName, inputChange: true, inputValue: value });
  }

  function validateFirstNameInput(value) {
    if (!firstName.inputChange) return;
    if (value.trim() === "") {
      setFirstName({
        ...firstName,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("name", value)) {
      setFirstName({ ...firstName, inputStatus: FORM_STATUS.success });
    } else {
      setFirstName({ ...firstName, inputStatus: FORM_STATUS.error });
    }
  }

  function setAreaOfWorkInput(value) {
    if (value === user.area_of_work) {
      setAreaOfWork({ ...areaOfWork, inputChange: false });
      return;
    }
    setAreaOfWork({ ...areaOfWork, inputChange: true, inputValue: value });
  }

  function setTitleInput(value) {
    if (user.desired_title === null && value.trim() === "") {
      setTitle({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.desired_title) {
      setTitle({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setTitle({ ...title, inputChange: true, inputValue: value });
  }

  function validateTitleInput(value) {
    if (!title.inputChange) return;
    if (value.trim() === "") {
      setTitle({ ...title, inputValue: "", inputStatus: FORM_STATUS.success });
    } else if (validateInput("title", value)) {
      setTitle({ ...title, inputStatus: FORM_STATUS.success });
    } else {
      setTitle({ ...title, inputStatus: FORM_STATUS.error });
    }
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

  async function getLocationsByValue(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location results" };
    }

    if (location.length > 0) {
      const results = res.data.filter(
        (prediction) => prediction.name !== location[0].name
      );
      return results;
    }

    return res.data;
  }

  async function setLocationWithGio(name, id) {
    setLocationChange(true);

    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location information" };
    }

    setLocation([
      {
        name,
        id,
        lat: res.data.lat,
        lon: res.data.lng,
      },
    ]);
  }

  function removeLocation() {
    setLocationChange(true);
    setLocation([]);
  }

  async function submitEdit(e) {
    e.preventDefault();

    if (
      firstName.inputStatus === FORM_STATUS.error ||
      title.inputStatus === FORM_STATUS.error ||
      summary.inputStatus === FORM_STATUS.error
    ) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    if (
      !firstName.inputChange &&
      !imageChange &&
      !areaOfWork.inputChange &&
      !title.inputChange &&
      !summary.inputChange &&
      !locationChange
    ) {
      return;
    }

    setFormStatus(FORM_STATUS.loading);
    const inputs = {};

    if (firstName.inputChange) {
      inputs.first_name = firstName.inputValue;
    }

    if (areaOfWork.inputChange) {
      inputs.area_of_work = areaOfWork.inputValue;
    }

    if (title.inputChange) {
      inputs.desired_title = title.inputValue;
    }

    if (summary.inputChange) {
      inputs.summary = summary.inputValue;
    }

    if (locationChange) {
      if (location.length > 0) {
        const { name, lat, lon } = location[0];
        inputs.current_location_name = name;
        inputs.current_location_lat = lat;
        inputs.current_location_lon = lon;
      } else {
        inputs.current_location_name = null;
        inputs.current_location_lat = null;
        inputs.current_location_lon = null;
      }
    }

    if (imageChange) {
      if (userImage.removeUserImage) {
        inputs.profile_image = "";
      }

      if (userImage.removeSavedAvatar) {
        inputs.avatar_image = "";
      }

      if (userImage.previewAvatar) {
        inputs.avatar_image = userImage.previewAvatar;
      }

      if (userImage.previewImage) {
        const [res, err] = await httpClient("POST", `/api/upload-main-image`, {
          imageUrl: userImage.previewImage,
          id: user.id,
        });

        if (err) {
          console.error(`${res.mssg} => ${res.err}`);
          setFormStatus(FORM_STATUS.error);
          setHasSubmitError(true);
          return;
        }

        inputs.profile_image = res.data.image;
      }
    }

    const results = await editProfile(inputs);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      return;
    }

    formSuccessWait = setTimeout(() => {
      history.push("/profile-dashboard");
    }, 750);
    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <WelcomeSection aria-labelledby="welcome-heading">
        <h2 id="welcome-heading">Welcome {user.first_name || "Newcomer"}!</h2>
        <div className="image-container">
          <WelcomeIntro />
        </div>
        <button
          ref={editInfoBtnRef}
          id="edit-info-btn"
          data-main-content="true"
          onClick={setFormInputs}
          onKeyDown={(e) => formFocusAction(e, FORM_STATUS.active)}
        >
          Edit Quickstart Information
        </button>
        <Link to="/profile-dashboard">Go Home</Link>
      </WelcomeSection>
    );
  }

  return (
    <section aria-labelledby="edit-information-heading edit-information-desc">
      <h2 id="edit-information-heading">Edit Information</h2>
      <p id="edit-information-desc">
        inputs are validated but not required to submit
      </p>

      {formStatus === FORM_STATUS.error ? (
        <div ref={errorSummaryRef} tabIndex="-1">
          <h3 id="error-heading">Errors in Submission</h3>
          {hasSubmitError ||
          firstName.inputStatus === FORM_STATUS.error ||
          title.inputStatus === FORM_STATUS.error ||
          summary.inputStatus === FORM_STATUS.error ? (
            <>
              <strong>
                Please address the following errors and re-submit the form:
              </strong>
              <ul aria-label="current errors" id="error-group">
                {hasSubmitError ? (
                  <li>Error submitting form, please try again</li>
                ) : null}
                {firstName.inputStatus === FORM_STATUS.error ? (
                  <li>
                    <a href="#first-name">First Name Error</a>
                  </li>
                ) : null}
                {title.inputStatus === FORM_STATUS.error ? (
                  <li>
                    <a href="#title">Title Error</a>
                  </li>
                ) : null}
                {summary.inputStatus === FORM_STATUS.error ? (
                  <li>
                    <a href="#summary">Summary Error</a>
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
      ) : null}

      <div className="tabs">
        <ul role="tablist" aria-label="quick start">
          <li role="presentation">
            <a
              ref={basicInfoTabRef}
              href="#basic-info-panel"
              id="basic-info"
              data-main-content={
                selectedTab === "basic-info" ? "true" : "false"
              }
              role="tab"
              tabIndex={selectedTab === "basic-info" ? "0" : "-1"}
              // aria-controls="basic-info-panel"
              aria-selected={selectedTab === "basic-info"}
              onClick={(e) => changeTab("basic-info", e)}
              onKeyDown={(e) => tabActions(e)}
            >
              Basic Info
            </a>
          </li>
          <li role="presentation">
            <a
              ref={billingInfoTabRef}
              href="#billing-info-panel"
              id="billing-info"
              data-main-content={
                selectedTab === "billing-info" ? "true" : "false"
              }
              role="tab"
              tabIndex={selectedTab === "billing-info" ? "0" : "-1"}
              // aria-controls="billing-info-panel"
              aria-selected={selectedTab === "billing-info"}
              onClick={(e) => changeTab("billing-info", e)}
              onKeyDown={(e) => tabActions(e)}
            >
              Billing info
            </a>
          </li>
        </ul>

        <section
          ref={basicInfoPanelRef}
          id="basic-info-panel"
          role="tabpanel"
          tabIndex="-1"
          aria-labelledby="basic-info"
          style={{
            display: selectedTab === "basic-info" ? "block" : "none",
          }}
        >
          <form onSubmit={(e) => submitEdit(e)}>
            <InputContainer>
              <label htmlFor="first-name">First Name:</label>
              <input
                type="text"
                autoComplete="given-name"
                id="first-name"
                name="first-name"
                className={`input ${
                  firstName.inputStatus === FORM_STATUS.error ? "input-err" : ""
                }`}
                aria-describedby="first-name-error first-name-success"
                aria-invalid={firstName.inputStatus === FORM_STATUS.error}
                value={firstName.inputValue}
                onChange={(e) => setFirstNameInput(e.target.value)}
                onBlur={(e) => validateFirstNameInput(e.target.value)}
              />
              {firstName.inputStatus === FORM_STATUS.error ? (
                <span id="first-name-error" className="err-mssg">
                  First Name can only be alphabelical characters, no numbers
                </span>
              ) : null}
              {firstName.inputStatus === FORM_STATUS.success ? (
                <span id="first-name-success" className="success-mssg">
                  First Name is Validated
                </span>
              ) : null}
            </InputContainer>

            <ImageBox setImageChange={setImageChange} />

            <FieldSet>
              <legend>Area of Work</legend>
              <div className="radio-buttons-container">
                <span className="radio-wrapper">
                  <input
                    type="radio"
                    name="area-of-work"
                    id="development"
                    value="Development"
                    defaultChecked={user.area_of_work === "Development"}
                    onClick={(e) => setAreaOfWorkInput(e.target.value)}
                  />
                  <label htmlFor="development">Development</label>
                </span>
                <span className="radio-wrapper">
                  <input
                    type="radio"
                    name="area-of-work"
                    id="ios"
                    value="iOS"
                    defaultChecked={user.area_of_work === "iOS"}
                    onClick={(e) => setAreaOfWorkInput(e.target.value)}
                  />
                  <label htmlFor="ios">iOS</label>
                </span>
                <span className="radio-wrapper">
                  <input
                    type="radio"
                    name="area-of-work"
                    id="android"
                    value="Android"
                    defaultChecked={user.area_of_work === "Android"}
                    onClick={(e) => setAreaOfWorkInput(e.target.value)}
                  />
                  <label htmlFor="android">Android</label>
                </span>
                <span className="radio-wrapper">
                  <input
                    type="radio"
                    name="area-of-work"
                    id="design"
                    value="Design"
                    defaultChecked={user.area_of_work === "Design"}
                    onClick={(e) => setAreaOfWorkInput(e.target.value)}
                  />
                  <label htmlFor="design">Design</label>
                </span>
              </div>
            </FieldSet>

            <InputContainer>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                autoComplete="organization-title"
                id="title"
                name="title"
                className={`input ${
                  title.inputStatus === FORM_STATUS.error ? "input-err" : ""
                }`}
                aria-describedby="title-error title-success"
                aria-invalid={title.inputStatus === FORM_STATUS.error}
                value={title.inputValue}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={(e) => validateTitleInput(e.target.value)}
              />
              {title.inputStatus === FORM_STATUS.error ? (
                <span id="title-error" className="err-mssg">
                  Title can only be alphabelical characters, no numbers
                </span>
              ) : null}
              {title.inputStatus === FORM_STATUS.success ? (
                <span id="title-success" className="success-mssg">
                  Title is Validated
                </span>
              ) : null}
            </InputContainer>

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
              chosenOptions={location}
              onInputChange={getLocationsByValue}
              onChosenOption={setLocationWithGio}
              onRemoveChosenOption={removeLocation}
              inputName={"current-location"}
              displayName={"Current Location"}
              single
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
        <section
          ref={billingInfoPanelRef}
          id="billing-info-panel"
          role="tabpanel"
          tabIndex="-1"
          aria-labelledby="billing-info"
          style={{
            display: selectedTab === "billing-info" ? "block" : "none",
          }}
        >
          <CheckoutContainer
            isMainContent={false}
            stripeId={user.stripe_customer_id}
            stripeSubId={user.stripe_subscription_name}
            email={user.email}
            id={user.id}
            editProfile={editProfile}
          />
        </section>
      </div>
    </section>
  );
}

const WelcomeSection = styled.section`
  .image-container {
    width: min(500px, 100%);
    height: auto;
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

const FieldSet = styled.fieldset`
  .radio-buttons-container {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    .radio-wrapper {
      margin: 0.7em;
    }
  }
`;

export default NewUser;
