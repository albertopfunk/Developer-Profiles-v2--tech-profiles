import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import ImageUploadForm from "../../../components/forms/image-upload";
import CheckoutContainer from "../../../components/forms/billing";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Combobox from "../../../components/forms/combobox";
import { Helmet } from "react-helmet";

let formSuccessWait;
function NewUser() {
  const { user, setPreviewImg, editProfile } = useContext(ProfileContext);
  const [selectedTab, setSelectedTab] = useState("basic-info");
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);

  const [firstName, setFirstName] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [previewImgInput, setPreviewImgInput] = useState({
    image: "",
    id: "",
    inputChange: false,
    shouldRemoveUserImage: false,
  });
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
    return () => {
      if (previewImgInput.id) {
        httpClient("POST", "/api/delete-image", {
          id: previewImgInput.id,
        });
      }
    };
  }, [previewImgInput]);

  useEffect(() => {
    return () => {
      setPreviewImg({ image: "", id: "" });
    };
  }, [setPreviewImg]);

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);

    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setPreviewImgInput({
      image: "",
      id: "",
      inputChange: false,
      shouldRemoveUserImage: false,
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

  function onTabChange(tab) {
    setSelectedTab(tab);
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

  function removeUserImageFromCloudinary() {
    if (user.image_id) {
      httpClient("POST", "/api/delete-image", {
        id: user.image_id,
      });
    }
  }

  function setImageInput(data) {
    setPreviewImg(data);
    setPreviewImgInput({
      ...data,
      inputChange: true,
      shouldRemoveUserImage: false,
    });
  }

  function removeImageInput(data) {
    setPreviewImg({ image: "", id: "" });
    setPreviewImgInput({
      ...data,
      inputChange: false,
      shouldRemoveUserImage: false,
    });
  }

  function removeUserImage(shouldRemove) {
    if (shouldRemove) {
      setPreviewImgInput({
        ...previewImgInput,
        shouldRemoveUserImage: true,
        inputChange: true,
      });
    } else {
      setPreviewImgInput({
        ...previewImgInput,
        shouldRemoveUserImage: false,
        inputChange: false,
      });
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
      return [];
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
      return;
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
      !previewImgInput.inputChange &&
      !previewImgInput.shouldRemoveUserImage &&
      !areaOfWork.inputChange &&
      !title.inputChange &&
      !summary.inputChange &&
      !locationChange
    ) {
      return;
    }

    const inputs = {};

    if (firstName.inputChange) {
      inputs.first_name = firstName.inputValue;
    }

    if (previewImgInput.inputChange) {
      removeUserImageFromCloudinary();
      if (previewImgInput.shouldRemoveUserImage) {
        inputs.image = "";
        inputs.image_id = "";
      } else {
        inputs.image = previewImgInput.image;
        inputs.image_id = previewImgInput.id;
        // setPreviewImg({ image: "", id: "" });
      }
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

    setFormStatus(FORM_STATUS.loading);
    await editProfile(inputs);
    formSuccessWait = setTimeout(() => {
      // route to home page instead
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
        <Helmet>
          <title>Profile Dashboard Welcome • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Welcome {user.first_name || "Newcomer"}!</h1>
        {/* welcome image */}
        <Link to="/profile-dashboard">Go Home</Link>
        <button onClick={setFormInputs}>Edit Quickstart Information</button>
      </Main>
    );
  }

  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Dashboard Welcome • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Welcome {user.first_name || "Newcomer"}!</h1>

      <section aria-labelledby="edit-information-heading">
        <h2 id="edit-information-heading">Edit Information</h2>
        {/* error summary */}
        <div className="tabs">
          <div role="tablist" aria-label="quick start">
            <button
              id="basic-info"
              role="tab"
              tabIndex="-1"
              aria-controls="basic-info-panel"
              aria-selected={selectedTab === "basic-info"}
              onClick={() => onTabChange("basic-info")}
            >
              Basic Info
            </button>
            <button
              id="billing-info"
              role="tab"
              tabIndex="-1"
              aria-controls="billing-info-panel"
              aria-selected={selectedTab === "billing-info"}
              onClick={() => onTabChange("billing-info")}
            >
              Billing
            </button>
          </div>

          <div
            id="basic-info-panel"
            role="tabpanel"
            tabIndex="0"
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
                    firstName.inputStatus === FORM_STATUS.error
                      ? "input-err"
                      : ""
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

              <ImageUploadForm
                previewImage={previewImgInput.image}
                userImage={user.image}
                setImageInput={setImageInput}
                removeImageInput={removeImageInput}
                removeUserImage={removeUserImage}
              />

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
                onClick={() => setFormStatus(FORM_STATUS.idle)}
              >
                Cancel
              </button>
            </form>
          </div>

          <div
            id="billing-info-panel"
            role="tabpanel"
            tabIndex="0"
            aria-labelledby="billing-info"
            style={{
              display: selectedTab === "billing-info" ? "block" : "none",
            }}
          >
            <CheckoutContainer
              stripeId={user.stripe_customer_id}
              stripeSubId={user.stripe_subscription_name}
              email={user.email}
              id={user.id}
              editProfile={editProfile}
            />
          </div>
        </div>
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
