import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import ImageUploadForm from "../../../components/forms/image-upload";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { STATUS } from "../../../global/helpers/variables";

/*

see if you can describe the form
"inputs are validated, but not required"

enum status on all

INPUTS
create inputs similar to bulma(remove from stretch)
enum status will make that simple

idle = nothing
loading = none needed for inputs
error = error mssg + error icon

success = sr.only success text + success icon
you can add success state onBlur when 
change === true && validationSuccess === true

otherwise if there is no change, it will remain idle



*/

function PersonalInfo() {
  const {
    user,
    submitLoading,
    editProfile,
    setPreviewImg,
    editInputs,
    setEditInputs,
  } = useContext(ProfileContext);

  const [submitError, setSubmitError] = useState(false);
  const [firstName, setFirstName] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: STATUS.idle,
  });
  const [lastName, setLastName] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: STATUS.idle,
  });
  const [image, setImage] = useState({
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
    inputStatus: STATUS.idle,
  });

  let errorSummaryRef = React.createRef();

  useEffect(() => {
    if (submitError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
    // another issue with required dependencies causing bugs
    // I am using this since I need to set focus to the
    // err summary element when user clicks submit with errors.
    // since state needs to change for the element to appear
    // and I can only set focus once the element appears, I have
    // to set focus AFTER state changes and component renders
    // so I am using useEffect to handle that
    // this works, but if I add the required errorSummaryRef
    // it will shift focus on that Ref on ANY state change/render
    // since refs are re-set each time
    // eslint-disable-next-line
  }, [submitError]);

  useEffect(() => {
    return () => {
      setEditInputs(false);
    };
  }, [setEditInputs]);

  function setFormInputs() {
    setEditInputs(true);
    setSubmitError(false);
    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputStatus: STATUS.idle,
    });
    setLastName({
      inputValue: user.last_name || "",
      inputChange: false,
      inputStatus: STATUS.idle,
    });
    setImage({
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
      inputStatus: STATUS.idle,
    });
  }

  function setFirstNameInput(value) {
    if (user.first_name === null && value.trim() === "") {
      setFirstName({
        inputChange: false,
        inputValue: "",
        inputStatus: STATUS.idle,
      });
      return;
    }

    if (value === user.first_name) {
      setFirstName({
        inputChange: false,
        inputValue: value,
        inputStatus: STATUS.idle,
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
        inputStatus: STATUS.success,
      });
    } else if (validateInput("name", value)) {
      setFirstName({ ...firstName, inputStatus: STATUS.success });
    } else {
      setFirstName({ ...firstName, inputStatus: STATUS.error });
    }
  }

  function setLastNameInput(value) {
    if (user.last_name === null && value.trim() === "") {
      setLastName({
        inputChange: false,
        inputValue: "",
        inputStatus: STATUS.idle,
      });
      return;
    }

    if (value === user.last_name) {
      setLastName({
        inputChange: false,
        inputValue: value,
        inputStatus: STATUS.idle,
      });
      return;
    }

    setLastName({ ...lastName, inputChange: true, inputValue: value });
  }

  function validateLastNameInput(value) {
    if (!lastName.inputChange) return;
    if (value.trim() === "") {
      setLastName({ ...lastName, inputValue: "", inputStatus: STATUS.success });
    } else if (validateInput("name", value)) {
      setLastName({ ...lastName, inputStatus: STATUS.success });
    } else {
      setLastName({ ...lastName, inputStatus: STATUS.error });
    }
  }

  function removeUserImageFromCloudinary() {
    if (user.image_id) {
      httpClient("POST", "/api/delete-image", {
        id: user.image_id,
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
        inputStatus: STATUS.idle,
      });
      return;
    }

    if (value === user.desired_title) {
      setTitle({
        inputChange: false,
        inputValue: value,
        inputStatus: STATUS.idle,
      });
      return;
    }

    setTitle({ ...title, inputChange: true, inputValue: value });
  }

  function validateTitleInput(value) {
    if (!title.inputChange) return;
    if (value.trim() === "") {
      setTitle({ ...title, inputValue: "", inputStatus: STATUS.success });
    } else if (validateInput("title", value)) {
      setTitle({ ...title, inputStatus: STATUS.success });
    } else {
      setTitle({ ...title, inputStatus: STATUS.error });
    }
  }

  function submitEdit(e) {
    e.preventDefault();

    if (
      firstName.inputStatus === STATUS.error ||
      lastName.inputStatus === STATUS.error ||
      title.inputStatus === STATUS.error
    ) {
      setSubmitError(true);
      return;
    }

    if (
      !firstName.inputChange &&
      !lastName.inputChange &&
      !image.inputChange &&
      !image.shouldRemoveUserImage &&
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

    if (image.inputChange) {
      removeUserImageFromCloudinary();
      inputs.image = image.image;
      inputs.image_id = image.id;
      localStorage.removeItem("image_id");
      setPreviewImg({ image: "", id: "" });
    } else if (image.shouldRemoveUserImage) {
      removeUserImageFromCloudinary();
      inputs.image = "";
      inputs.image_id = "";
    }

    if (areaOfWork.inputChange) {
      inputs.area_of_work = areaOfWork.inputValue;
    }

    if (title.inputChange) {
      inputs.desired_title = title.inputValue;
    }

    console.log("SUB", inputs);
    editProfile(inputs);
  }

  if (!editInputs) {
    return (
      <main aria-labelledby="personal-info-heading-1">
        <Helmet>
          <title>Dashboard Personal Info | Tech Profiles</title>
        </Helmet>
        <h1 id="personal-info-heading-1">Personal Info</h1>
        <section aria-labelledby="personal-info-heading-2">
          <h2 id="personal-info-heading-2">Current Information</h2>
          <button onClick={setFormInputs}>Edit Information</button>
          <ul>
            <li>First Name: {user.first_name || "None Set"}</li>
            <li>Last Name: {user.last_name || "None Set"}</li>
            <li>
              {user.image ? (
                <>
                  <p>Image:</p>
                  {/* what is a good alt tag for your profile image? */}
                  <img src={user.image} alt="Your Profile Pic" />
                </>
              ) : (
                "Image: None Set"
              )}
            </li>
            <li>Area of Work: {user.area_of_work || "None Set"}</li>
            <li>Title: {user.desired_title || "None Set"}</li>
          </ul>
        </section>
      </main>
    );
  }

  return (
    <main aria-labelledby="personal-info-heading">
      <Helmet>
        <title>Dashboard Personal Info | Tech Profiles</title>
      </Helmet>
      <h1 id="personal-info-heading">Personal Info</h1>

      <FormSection aria-labelledby="edit-info-heading">
        <h2 id="edit-info-heading">Edit Information</h2>
        <div
          aria-live="assertive"
          aria-relevant="additions removals"
          aria-labelledby="error-heading"
          className={`error-summary ${submitError ? "" : "hidden"}`}
        >
          <h3 id="error-heading" ref={errorSummaryRef} tabIndex="0">
            Errors in Submission
          </h3>

          {firstName.inputStatus === STATUS.error ||
          lastName.inputStatus === STATUS.error ||
          title.inputStatus === STATUS.error ? (
            <>
              <strong id="error-instructions">
                Please address the following errors and re-submit the form:
              </strong>
              {/* // header is fixed so it covers input */}
              <ul id="error-group" aria-labelledby="error-instructions">
                {firstName.inputStatus === STATUS.error ? (
                  <li>
                    <a href="#first-name">First Name Error</a>
                  </li>
                ) : null}
                {lastName.inputStatus === STATUS.error ? (
                  <li>
                    <a href="#last-name">Last Name Error</a>
                  </li>
                ) : null}
                {title.inputStatus === STATUS.error ? (
                  <li>
                    <a href="#title">Title Error</a>
                  </li>
                ) : null}
              </ul>
            </>
          ) : (
            <p>No Errors, ready to submit</p>
          )}
        </div>

        <form onSubmit={(e) => submitEdit(e)}>
          <InputContainer>
            <label id="first-name-label" htmlFor="first-name">
              First Name:
            </label>
            <input
              type="text"
              autoComplete="given-name"
              inputMode="text"
              id="first-name"
              name="first-name"
              className={`input ${
                firstName.inputStatus === STATUS.error ? "input-err" : ""
              }`}
              aria-labelledby="first-name-label"
              aria-describedby="first-name-error"
              aria-invalid={firstName.inputStatus === STATUS.error}
              value={firstName.inputValue}
              onChange={(e) => setFirstNameInput(e.target.value)}
              onBlur={(e) => validateFirstNameInput(e.target.value)}
            />
            {firstName.inputStatus === STATUS.error ? (
              <span id="first-name-error" role="status" className="err-mssg">
                First Name can only be alphabelical characters, no numbers
              </span>
            ) : null}
          </InputContainer>

          <InputContainer>
            <label id="last-name-label" htmlFor="last-name">
              Last Name:
            </label>
            <input
              type="text"
              autoComplete="family-name"
              inputMode="text"
              id="last-name"
              name="last-name"
              className={`input ${
                lastName.inputStatus === STATUS.error ? "input-err" : ""
              }`}
              aria-labelledby="last-name-label"
              aria-describedby="last-name-error"
              aria-invalid={lastName.inputStatus === STATUS.error}
              value={lastName.inputValue}
              onChange={(e) => setLastNameInput(e.target.value)}
              onBlur={(e) => validateLastNameInput(e.target.value)}
            />
            {lastName.inputStatus === STATUS.error ? (
              <span id="last-name-error" role="status" className="err-mssg">
                Last Name can only be alphabelical characters, no numbers
              </span>
            ) : null}
          </InputContainer>

          <ImageUploadForm imageInput={image} setImageInput={setImage} />

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
            <label id="title-label" htmlFor="title">
              Title:
            </label>
            <input
              type="text"
              autoComplete="organization-title"
              inputMode="text"
              id="title"
              name="title"
              className={`input ${
                title.inputStatus === STATUS.error ? "input-err" : ""
              }`}
              aria-labelledby="title-label"
              aria-describedby="title-error"
              aria-invalid={title.inputStatus === STATUS.error}
              value={title.inputValue}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={(e) => validateTitleInput(e.target.value)}
            />
            {title.inputStatus === STATUS.error ? (
              <span id="title-error" role="status" className="err-mssg">
                Title can only be alphabelical characters, no numbers
              </span>
            ) : null}
          </InputContainer>

          <button disabled={submitLoading} type="submit">
            {submitLoading ? "loading..." : "Submit"}
          </button>
          <button
            disabled={submitLoading}
            type="reset"
            onClick={() => setEditInputs(false)}
          >
            Cancel
          </button>
        </form>
      </FormSection>
    </main>
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
