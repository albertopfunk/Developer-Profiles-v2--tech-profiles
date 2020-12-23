import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import ImageUploadForm from "../../../components/forms/image-upload";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function PersonalInfo() {
  const { user, editProfile, setPreviewImg } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [announceFormStatus, setAnnounceFormStatus] = useState(false);

  const [firstName, setFirstName] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [lastName, setLastName] = useState({
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

  let errorSummaryRef = React.createRef();

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
    // another issue with required dependencies causing bugs.
    // I am using this since I need to set focus to the
    // err summary element when user clicks submit with errors.
    // since state needs to change for the element to appear
    // and I can only set focus once the element appears, I have
    // to set focus AFTER state changes and component renders.
    // so I am using useEffect to handle that
    // this works, but if I add the required errorSummaryRef
    // it will shift focus on that Ref on ANY state change/render
    // when form is in an error state
    // since refs are re-set each time
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
    setAnnounceFormStatus(true);

    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setLastName({
      inputValue: user.last_name || "",
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

  function setLastNameInput(value) {
    if (user.last_name === null && value.trim() === "") {
      setLastName({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.last_name) {
      setLastName({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setLastName({ ...lastName, inputChange: true, inputValue: value });
  }

  function validateLastNameInput(value) {
    if (!lastName.inputChange) return;
    if (value.trim() === "") {
      setLastName({
        ...lastName,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("name", value)) {
      setLastName({ ...lastName, inputStatus: FORM_STATUS.success });
    } else {
      setLastName({ ...lastName, inputStatus: FORM_STATUS.error });
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

  async function submitEdit(e) {
    e.preventDefault();

    if (
      firstName.inputStatus === FORM_STATUS.error ||
      lastName.inputStatus === FORM_STATUS.error ||
      title.inputStatus === FORM_STATUS.error
    ) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    if (
      !firstName.inputChange &&
      !lastName.inputChange &&
      !previewImgInput.inputChange &&
      !previewImgInput.shouldRemoveUserImage &&
      !areaOfWork.inputChange &&
      !title.inputChange
    ) {
      return;
    }

    const inputs = {};

    if (firstName.inputChange) {
      inputs.first_name = firstName.inputValue;
    }

    if (lastName.inputChange) {
      inputs.last_name = lastName.inputValue;
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

    setFormStatus(FORM_STATUS.loading);
    await editProfile(inputs);
    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <>
        <Helmet>
          <title>Profile Dashboard Personal Info • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Personal Info</h1>
        {announceFormStatus ? (
          <Announcer
            announcement="Form is idle, press edit information button to open"
            ariaId="form-idle-announcement"
          />
        ) : null}
        <section aria-labelledby="current-information-heading">
          <h2 id="current-information-heading">Current Information</h2>
          <button
            id="edit-info-btn"
            data-main-content="true"
            onClick={setFormInputs}
          >
            Edit Information
          </button>
          <ul aria-label="current information">
            <li>First Name: {user.first_name || "None Set"}</li>
            <li>Last Name: {user.last_name || "None Set"}</li>
            <li>
              {user.image ? (
                <>
                  <p>Profile Pic:</p>
                  <img src={user.image} alt="profile pic" />
                </>
              ) : (
                "Profile Pic: None Set"
              )}
            </li>
            <li>Area of Work: {user.area_of_work || "None Set"}</li>
            <li>Title: {user.desired_title || "None Set"}</li>
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Personal Info • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Personal Info</h1>
      {announceFormStatus && formStatus === FORM_STATUS.active ? (
        <Announcer
          announcement="Form is active, inputs are validated but not required to submit"
          ariaId="active-form-announcer"
        />
      ) : null}
      {announceFormStatus && formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="Successfully submitted information"
          ariaId="success-form-announcer"
        />
      ) : null}

      <FormSection
        id="profile-information"
        tabIndex="-1"
        aria-labelledby="edit-information-heading"
      >
        <h2 id="edit-information-heading">Edit Information</h2>

        {formStatus === FORM_STATUS.error ? (
          <div ref={errorSummaryRef} tabIndex="-1">
            <h3 id="error-heading">Errors in Submission</h3>
            {firstName.inputStatus === FORM_STATUS.error ||
            lastName.inputStatus === FORM_STATUS.error ||
            title.inputStatus === FORM_STATUS.error ? (
              <>
                <strong>
                  Please address the following errors and re-submit the form:
                </strong>
                <ul aria-label="current errors" id="error-group">
                  {firstName.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#first-name">First Name Error</a>
                    </li>
                  ) : null}
                  {lastName.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#last-name">Last Name Error</a>
                    </li>
                  ) : null}
                  {title.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#title">Title Error</a>
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

          <InputContainer>
            <label htmlFor="last-name">Last Name:</label>
            <input
              type="text"
              autoComplete="family-name"
              id="last-name"
              name="last-name"
              className={`input ${
                lastName.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="last-name-error last-name-success"
              aria-invalid={lastName.inputStatus === FORM_STATUS.error}
              value={lastName.inputValue}
              onChange={(e) => setLastNameInput(e.target.value)}
              onBlur={(e) => validateLastNameInput(e.target.value)}
            />
            {lastName.inputStatus === FORM_STATUS.error ? (
              <span id="last-name-error" className="err-mssg">
                Last Name can only be alphabelical characters, no numbers
              </span>
            ) : null}
            {lastName.inputStatus === FORM_STATUS.success ? (
              <span id="last-name-success" className="success-mssg">
                Last Name is Validated
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
      </FormSection>
    </>
  );
}

const FormSection = styled.section`
  .hidden {
    display: none;
  }
  .error-summary {
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

export default PersonalInfo;
