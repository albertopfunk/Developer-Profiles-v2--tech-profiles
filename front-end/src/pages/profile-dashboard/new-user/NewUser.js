import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as WelcomeIntro } from "../../../global/assets/dashboard-intro.svg";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import styled from "styled-components";

import ImageBox from "../../../components/forms/images/imageBox";
import CheckoutContainer from "../../../components/forms/billing";
import Combobox from "../../../components/forms/combobox";
import ControlButton from "../../../components/forms/buttons/ControlButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

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

  let isSubmittingRef = useRef(false);
  let errorSummaryRef = React.createRef();
  let editInfoBtnRef = React.createRef();
  let basicInfoTabRef = React.createRef();
  let basicInfoPanelRef = React.createRef();
  let billingInfoTabRef = React.createRef();
  let billingInfoPanelRef = React.createRef();
  let firstNameInputRef = React.createRef();
  let titleInputRef = React.createRef();
  let summaryInputRef = React.createRef();

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
    if (!user.first_name && value.trim() === "") {
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
    if (isSubmittingRef.current) return;
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
    if (!user.desired_title && value.trim() === "") {
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
    if (isSubmittingRef.current) return;
    if (value.trim() === "") {
      setTitle({ ...title, inputValue: "", inputStatus: FORM_STATUS.success });
    } else if (validateInput("title", value)) {
      setTitle({ ...title, inputStatus: FORM_STATUS.success });
    } else {
      setTitle({ ...title, inputStatus: FORM_STATUS.error });
    }
  }

  function setSummaryInput(value) {
    if (!user.summary && value.trim() === "") {
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
    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location information" };
    }

    let locationChange;
    if (user.current_location_name === name) {
      locationChange = false;
    } else {
      locationChange = true;
    }

    setLocationChange(locationChange);
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
    let locationChange;
    if (!user.current_location_name) {
      locationChange = false;
    } else {
      locationChange = true;
    }

    setLocationChange(locationChange);
    setLocation([]);
  }

  async function submitEdit(e) {
    e.preventDefault();

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
    isSubmittingRef.current = true;
    let areThereErrors = false;
    const inputs = {};

    if (firstName.inputChange) {
      if (firstName.inputValue.trim() === "") {
        inputs.first_name = "";
        firstNameInputRef.current.blur();
        setFirstName({
          ...firstName,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("name", firstName.inputValue)) {
        inputs.first_name = firstName.inputValue;
        firstNameInputRef.current.blur();
        setFirstName({ ...firstName, inputStatus: FORM_STATUS.success });
      } else {
        areThereErrors = true;
        setFirstName({ ...firstName, inputStatus: FORM_STATUS.error });
      }
    }

    if (title.inputChange) {
      if (title.inputValue.trim() === "") {
        inputs.desired_title = "";
        titleInputRef.current.blur();
        setTitle({
          ...title,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("title", title.inputValue)) {
        inputs.desired_title = title.inputValue;
        titleInputRef.current.blur();
        setTitle({ ...title, inputStatus: FORM_STATUS.success });
      } else {
        areThereErrors = true;
        setTitle({ ...title, inputStatus: FORM_STATUS.error });
      }
    }

    if (summary.inputChange) {
      if (summary.inputValue.trim() === "") {
        inputs.summary = "";
        summaryInputRef.current.blur();
        setSummary({
          ...summary,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("summary", summary.inputValue)) {
        inputs.summary = summary.inputValue;
        summaryInputRef.current.blur();
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

    if (areaOfWork.inputChange) {
      inputs.area_of_work = areaOfWork.inputValue;
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
          isSubmittingRef.current = false;
          return;
        }

        inputs.profile_image = res.data.image;
      }
    }

    const results = await editProfile(inputs);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      isSubmittingRef.current = false;
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
        <h2 id="welcome-heading">Welcome, {user.first_name || "Newcomer"}!</h2>
        <Spacer axis="vertical" size="5" />
        <div className="image-container">
          <WelcomeIntro />
        </div>
        <Spacer axis="vertical" size="15" />
        <div className="controls-container">
          <ControlButton
            ref={editInfoBtnRef}
            buttonText="quickstart"
            ariaLabel="form"
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusAction(e, FORM_STATUS.active)}
            attributes={{
              id: "edit-info-btn",
            }}
          />

          <Link to="/profile-dashboard">
            <span className="link-text">Go Home</span>
          </Link>
        </div>
      </WelcomeSection>
    );
  }

  return (
    <FormSection aria-labelledby="edit-information-heading edit-information-desc">
      <div className="edit-info-header">
        <h2 id="edit-information-heading">Edit Info</h2>
        <button
          disabled={
            formStatus === FORM_STATUS.loading ||
            formStatus === FORM_STATUS.success
          }
          type="reset"
          className="button edit-button"
          onClick={resetForm}
          onKeyDown={(e) => formFocusAction(e, FORM_STATUS.idle)}
        >
          <span className="sr-only">close</span>
          <span className="button-icon">
            <CloseIcon className="icon" />
          </span>
        </button>
      </div>
      <p id="edit-information-desc" className="sr-only">
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
      <Spacer axis="vertical" size="15" />
      <div className="tabs-container">
        <ul className="tablist" role="tablist" aria-label="quick start">
          <li role="presentation" className="tab">
            <a
              ref={basicInfoTabRef}
              href="#basic-info-panel"
              className={`tab-link ${
                selectedTab === "basic-info" ? "selected" : ""
              }`}
              id="basic-info"
              role="tab"
              tabIndex={selectedTab === "basic-info" ? "0" : "-1"}
              // aria-controls="basic-info-panel"
              aria-selected={selectedTab === "basic-info"}
              onClick={(e) => changeTab("basic-info", e)}
              onKeyDown={(e) => tabActions(e)}
            >
              <span className="link-text">basic info</span>
            </a>
          </li>
          <li role="presentation" className="tab">
            <a
              ref={billingInfoTabRef}
              href="#billing-info-panel"
              className={`tab-link ${
                selectedTab === "billing-info" ? "selected" : ""
              }`}
              id="billing-info"
              role="tab"
              tabIndex={selectedTab === "billing-info" ? "0" : "-1"}
              // aria-controls="billing-info-panel"
              aria-selected={selectedTab === "billing-info"}
              onClick={(e) => changeTab("billing-info", e)}
              onKeyDown={(e) => tabActions(e)}
            >
              <span className="link-text">billing info</span>
            </a>
          </li>
        </ul>
        <Spacer axis="vertical" size="20" />
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
              <Spacer axis="vertical" size="5" />
              <input
                ref={firstNameInputRef}
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
            <Spacer axis="vertical" size="30" />
            <ImageBox setImageChange={setImageChange} />
            <Spacer axis="vertical" size="30" />
            <FieldSet>
              <legend>Area of Work</legend>
              <Spacer axis="vertical" size="5" />
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
            <Spacer axis="vertical" size="20" />
            <InputContainer>
              <label htmlFor="title">Title:</label>
              <Spacer axis="vertical" size="5" />
              <input
                ref={titleInputRef}
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
            <Spacer axis="vertical" size="20" />
            <InputContainer>
              <label htmlFor="summary">Profile Summary:</label>
              <Spacer axis="vertical" size="5" />
              <textarea
                ref={summaryInputRef}
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
            <Spacer axis="vertical" size="20" />
            <Combobox
              chosenOptions={location}
              onInputChange={getLocationsByValue}
              onChosenOption={setLocationWithGio}
              onRemoveChosenOption={removeLocation}
              inputName={"current-location"}
              displayName={"Current Location"}
              single
            />
            <Spacer axis="vertical" size="20" />
            <ControlButton
              type="submit"
              classNames="submit-button"
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
    </FormSection>
  );
}

const WelcomeSection = styled.section`
  width: 100%;
  text-align: center;

  .controls-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;

    button {
      flex-basis: 40%;
    }
    a {
      flex-basis: 40%;
      display: inline-block;
      white-space: nowrap;
      padding: 13px 15px 10px; // 13px for bottom borders
      border: solid 1px rgba(229, 231, 235, 0.8);

      &:focus-visible {
        outline-width: 3px;
        outline-color: transparent;
        box-shadow: inset 0 0 0 2.5px #2727ad;
      }

      &:hover .link-text {
        border-bottom: solid 1px;
      }
      &:focus .link-text {
        outline: 0.25rem solid transparent;
        border-bottom: solid 1px;
      }

      .link-text {
        border-bottom: solid 1px transparent;
      }
    }
  }
`;

const FormSection = styled.section`
  min-width: 0;

  .edit-info-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;

    .edit-button {
      width: 100%;
      max-width: 35px;
      border-radius: 10px;
      height: 35px;
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

  .tablist {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;

    .tab-link {
      display: inline-block;
      white-space: nowrap;
      padding: 13px 15px 10px; // 13px for bottom borders
      border: solid 1px rgba(229, 231, 235, 0.8);
      border-bottom: solid 2px transparent;

      &:focus-visible {
        outline-width: 3px;
        outline-color: transparent;
        box-shadow: inset 0 0 0 2.5px #2727ad;
      }

      &:hover .link-text {
        border-bottom: solid 1px;
      }
      &:focus .link-text {
        outline: 0.25rem solid transparent;
        border-bottom: solid 1px;
      }

      &.selected .link-text {
        border-bottom: solid 1px transparent;
      }

      &.selected {
        border-bottom: solid 2px;
      }

      .link-text {
        border-bottom: solid 1px transparent;
      }
    }
  }

  .submit-button {
    width: 90%;
    max-width: 350px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* max-width: 450px; */

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
  max-width: 450px;

  .radio-buttons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .radio-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 3px;
    }
  }
`;

export default NewUser;
