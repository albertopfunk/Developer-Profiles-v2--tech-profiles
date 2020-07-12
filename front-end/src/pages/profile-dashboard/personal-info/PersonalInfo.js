import React, { useState, useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import ImageUploadForm from "../../../components/forms/image-upload";
import { validateInput } from "../../../global/helpers/validation";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

/*

see if you can describe the form
"inputs are validated, but not required"

provide relevant instructions/requirements for inputs if needed(date format, social url/username format)
you can add them to another span, and show it if you want
connect it with input using aria-describedby
ex aria-describedby="nameReq nameError"

you can also have shown and sr.only elements
might have to use this for validation messages
A-Z, a-z, 0-9 vs capital and lowercase alphabetic characters, numbers

need to have page titles
h1 for dashboard, see if you can make it dynamic to match current inpage route

validation needs to be done in the back end as well
since hackers can bypass client



2 types of validation

ON BLUR
regex validation
toggle validation err for input

ON SUBMIT
regex validation on all
since each input will have their own validation error
just check which still need validation and create a summary
see if you can put all validations in 1 state object

remove image might need a loader

maybe have 1 main loader that shows in the button like the original
this would be seperate from user loading skeleton




!STATES

ASYNC
Submit loading
no async side effects needed
delete-image is a background side effect



*/

function PersonalInfo() {
  const { loadingUser, user, editProfile, setPreviewImg } = useContext(
    ProfileContext
  );

  const [editInputs, setEditInputs] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [firstName, setFirstName] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });
  const [lastName, setLastName] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });
  const [image, setImage] = useState({
    image: "",
    id: "",
    inputChange: false
  });
  const [areaOfWork, setAreaOfWork] = useState({
    inputValue: "",
    inputChange: false
  });
  const [title, setTitle] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });

  let errorSummaryRef = React.createRef();

  function onEditInputs() {
    setSubmitError(false);
    setEditInputs(true);
    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputError: false
    });
    setLastName({
      inputValue: user.last_name || "",
      inputChange: false,
      inputError: false
    });
    setImage({
      image: "",
      id: "",
      inputChange: false
    });
    setAreaOfWork({
      inputValue: "",
      inputChange: false
    });
    setTitle({
      inputValue: user.desired_title || "",
      inputChange: false,
      inputError: false
    });
  }

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

  function onFirstNameInputChange(value) {
    if (value === user.first_name) {
      setFirstName({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
      return;
    }

    setFirstName({ ...firstName, inputChange: true, inputValue: value });
  }

  function onFirstNameInputValidate(value) {
    if (!firstName.inputChange) return;
    if (value.trim() === "") {
      setFirstName({ ...firstName, inputValue: "", inputError: false });
    } else if (validateInput("name", value)) {
      setFirstName({ ...firstName, inputError: false });
    } else {
      setFirstName({ ...firstName, inputError: true });
    }
  }

  function onLastNameInputChange(value) {
    if (value === user.last_name) {
      setLastName({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
    }

    setLastName({ ...lastName, inputChange: true, inputValue: value });
  }

  function onLastNameInputValidate(value) {
    if (!lastName.inputChange) return;
    if (value.trim() === "") {
      setLastName({ ...lastName, inputValue: "", inputError: false });
    } else if (validateInput("name", value)) {
      setLastName({ ...lastName, inputError: false });
    } else {
      setLastName({ ...lastName, inputError: true });
    }
  }

  function onImageInputChange(value) {
    setImage({ ...value, inputChange: true });
  }

  function removeOldImage() {
    if (user.image_id) {
      httpClient("POST", "/api/delete-image", {
        id: user.image_id
      });
    }
  }

  function removeImage() {
    console.log("removeeeee");
    // should not remove on the spot
    // should set the image to remove
    // UI that tells user this image will be removed,
    // preview image will replace UI if user chooses another image after removing current
  }

  function onAreaOfWorkInputChange(value) {
    if (value === user.area_of_work) {
      setAreaOfWork({ ...areaOfWork, inputChange: false });
      return;
    }
    setAreaOfWork({ ...areaOfWork, inputChange: true, inputValue: value });
  }

  function onTitleInputChange(value) {
    if (value === user.desired_title) {
      setTitle({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
      return;
    }

    setTitle({ ...title, inputChange: true, inputValue: value });
  }

  function onTitleInputValidate(value) {
    if (!title.inputChange) return;
    if (value.trim() === "") {
      setTitle({ ...title, inputValue: "", inputError: false });
    } else if (validateInput("title", value)) {
      setTitle({ ...title, inputError: false });
    } else {
      setTitle({ ...title, inputError: true });
    }
  }

  function submitEdit(e) {
    e.preventDefault();

    if (firstName.inputError || lastName.inputError || title.inputError) {
      setSubmitError(true);
      return;
    }

    if (
      !firstName.inputChange &&
      !lastName.inputChange &&
      !image.inputChange &&
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
      removeOldImage();
      inputs.image = image.image;
      inputs.image_id = image.id;
      localStorage.removeItem("image_id");
      setPreviewImg({ image: "", id: "" });
    }

    if (areaOfWork.inputChange) {
      inputs.area_of_work = areaOfWork.inputValue;
    }

    if (title.inputChange) {
      inputs.desired_title = title.inputValue;
    }

    console.log("SUB", inputs);
    setEditInputs(false);
    editProfile(inputs);
  }

  function resetInputs() {
    setEditInputs(false);
  }

  if (loadingUser) {
    // skeleton loader
    return <h1>Loading...</h1>;
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
          <button onClick={onEditInputs}>Edit Information</button>
          <div>
            <p>First Name: {user.first_name || "None Set"}</p>
            <p>Last Name: {user.last_name || "None Set"}</p>
            <div>
              {user.image ? (
                <>
                  <p>Image:</p>
                  {/* what is a good alt tag for your profile image? */}
                  <img src={user.image} alt="Your Profile Pic" />
                </>
              ) : (
                <p>Image: None Set</p>
              )}
            </div>
            <p>Area of Work: {user.area_of_work || "None Set"}</p>
            <p>Title: {user.desired_title || "None Set"}</p>
          </div>
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
          ref={errorSummaryRef}
          tabIndex="0"
          aria-live="polite"
          aria-labelledby="error-heading"
          className={`error-summary ${submitError ? "" : "hidden"}`}
        >
          <h3 id="error-heading">Error Summary</h3>
          {firstName.inputError ? <p>First Name Error</p> : null}
          {lastName.inputError ? <p>Last Name Error</p> : null}
          {title.inputError ? <p>Title Error</p> : null}
          {!firstName.inputError &&
          !lastName.inputError &&
          !title.inputError ? (
            <p>No Errors, ready to submit</p>
          ) : null}
        </div>

        <form onSubmit={e => submitEdit(e)}>
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
              className={`input ${firstName.inputError ? "input-err" : ""}`}
              aria-labelledby="first-name-label"
              aria-describedby="first-name-error"
              aria-invalid={firstName.inputError}
              value={firstName.inputValue}
              onChange={e => onFirstNameInputChange(e.target.value)}
              onBlur={e => onFirstNameInputValidate(e.target.value)}
            />
            {firstName.inputError ? (
              <span
                id="first-name-error"
                className="err-mssg"
                aria-live="polite"
              >
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
              aria-labelledby="last-name-label"
              aria-describedby="last-name-error"
              aria-invalid={lastName.inputError}
              value={lastName.inputValue}
              onChange={e => onLastNameInputChange(e.target.value)}
              onBlur={e => onLastNameInputValidate(e.target.value)}
            />
            {lastName.inputError ? (
              <span
                id="last-name-error"
                className="err-mssg"
                aria-live="polite"
              >
                Last Name can only be alphabelical characters, no numbers
              </span>
            ) : null}
          </InputContainer>

          <div>
            <ImageUploadForm
              setImageInput={onImageInputChange}
              imageInput={image}
            />
            {user.image || image.image ? (
              <div style={{ height: "200px", width: "200px" }}>
                {!image.image ? (
                  <span
                    style={{
                      position: "absolute",
                      top: "5%",
                      right: "5%",
                      border: "solid",
                      zIndex: "1"
                    }}
                    onClick={removeImage}
                  >
                    X
                  </span>
                ) : null}

                <img
                  style={{ height: "200px", width: "200px" }}
                  src={image.image || user.image}
                  alt="current profile pic"
                />
              </div>
            ) : null}
          </div>

          <br />
          <br />
          <br />

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
                  onClick={e => onAreaOfWorkInputChange(e.target.value)}
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
                  onClick={e => onAreaOfWorkInputChange(e.target.value)}
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
                  onClick={e => onAreaOfWorkInputChange(e.target.value)}
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
                  onClick={e => onAreaOfWorkInputChange(e.target.value)}
                />
                <label htmlFor="design">Design</label>
              </span>
            </div>
          </FieldSet>

          <br />
          <br />
          <br />

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
              className={`input ${title.inputError ? "input-err" : ""}`}
              aria-labelledby="title-label"
              aria-describedby="title-error"
              aria-invalid={title.inputError}
              value={title.inputValue}
              onChange={e => onTitleInputChange(e.target.value)}
              onBlur={e => onTitleInputValidate(e.target.value)}
            />
            {title.inputError ? (
              <span id="title-error" className="err-mssg" aria-live="polite">
                Title can only be alphabelical characters, no numbers
              </span>
            ) : null}
          </InputContainer>

          <button type="submit">Submit</button>
          <button type="reset" onClick={resetInputs}>
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
