import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";

import ImageBox from "../../../components/forms/images/imageBox";
import ControlButton from "../../../components/forms/buttons/ControlButton";
import IconButton from "../../../components/forms/buttons/IconButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import useToggle from "../../../global/helpers/hooks/useToggle";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

let formSuccessWait;
function PersonalInfo() {
  const { user, editProfile, userImage } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [formFocusToggle, setFormFocusToggle] = useToggle();
  const [hasSubmitError, setHasSubmitError] = useState(null);

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
      !firstName.inputChange &&
      !lastName.inputChange &&
      !imageChange &&
      !areaOfWork.inputChange &&
      !title.inputChange
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

    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setImageChange(false);
    setLastName({
      inputValue: user.last_name || "",
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
  }

  function setFirstNameInput(value) {
    if (!user.first_name && value.trim() === "") {
      setFirstName({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.first_name) {
      setFirstName({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
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

  function setImage(change) {
    if (!change) {
      setCheckChangesToggle();
    }

    setImageChange(change);
  }

  function setLastNameInput(value) {
    if (!user.last_name && value.trim() === "") {
      setLastName({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.last_name) {
      setLastName({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setLastName({ ...lastName, inputChange: true, inputValue: value });
  }

  function validateLastNameInput(value) {
    if (!lastName.inputChange) return;
    if (isSubmittingRef.current) return;
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

  function setAreaOfWorkInput(value) {
    if (value === user.area_of_work) {
      setAreaOfWork({ ...areaOfWork, inputChange: false });
      setCheckChangesToggle();
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
      setCheckChangesToggle();
      return;
    }

    if (value === user.desired_title) {
      setTitle({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
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

  async function submitEdit(e) {
    e.preventDefault();

    // check for changes
    if (
      !firstName.inputChange &&
      !lastName.inputChange &&
      !imageChange &&
      !areaOfWork.inputChange &&
      !title.inputChange
    ) {
      return;
    }

    // set loading
    setFormStatus(FORM_STATUS.loading);
    isSubmittingRef.current = true;

    // validate and set up requests
    let areThereErrors = false;
    const inputs = {};

    if (firstName.inputChange) {
      if (firstName.inputValue.trim() === "") {
        inputs.first_name = "";
        setFirstName({
          ...firstName,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("name", firstName.inputValue)) {
        inputs.first_name = firstName.inputValue;
        setFirstName({ ...firstName, inputStatus: FORM_STATUS.success });
      } else {
        areThereErrors = true;
        setFirstName({ ...firstName, inputStatus: FORM_STATUS.error });
      }
    }

    if (lastName.inputChange) {
      if (lastName.inputValue.trim() === "") {
        inputs.last_name = "";
        setLastName({
          ...lastName,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("name", lastName.inputValue)) {
        inputs.last_name = lastName.inputValue;
        setLastName({ ...lastName, inputStatus: FORM_STATUS.success });
      } else {
        areThereErrors = true;
        setLastName({ ...lastName, inputStatus: FORM_STATUS.error });
      }
    }

    if (title.inputChange) {
      if (title.inputValue.trim() === "") {
        inputs.desired_title = "";
        setTitle({
          ...title,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("title", title.inputValue)) {
        inputs.desired_title = title.inputValue;
        setTitle({ ...title, inputStatus: FORM_STATUS.success });
      } else {
        areThereErrors = true;
        setTitle({ ...title, inputStatus: FORM_STATUS.error });
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
    if (areaOfWork.inputChange) {
      inputs.area_of_work = areaOfWork.inputValue;
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

    // submit
    const results = await editProfile(inputs);

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
                <dt>First Name:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.first_name || "None Set"}</dd>
              </div>
              <div>
                <dt>Last Name:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.last_name || "None Set"}</dd>
              </div>
              <div className="image-container">
                <dt>Profile Pic:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>
                  {user.profile_image || user.avatar_image ? (
                    <img
                      src={user.profile_image || user.avatar_image}
                      alt="saved pic"
                    />
                  ) : (
                    "None Set"
                  )}
                </dd>
              </div>
            </div>
            <div className="flex-col">
              <div>
                <dt>Area of Work:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.area_of_work || "None Set"}</dd>
              </div>
              <div>
                <dt>Title</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.desired_title || "None Set"}</dd>
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
          announcement="Successfully submitted information"
          ariaId="success-form-announcer"
        />
      ) : null}
      <FormSection aria-labelledby="edit-information-heading">
        <div className="edit-info-header">
          <h2 id="edit-information-heading">Edit Info</h2>
          <IconButton
            ref={resetBtnRef}
            type="reset"
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
              {hasSubmitError ||
              firstName.inputStatus === FORM_STATUS.error ||
              lastName.inputStatus === FORM_STATUS.error ||
              title.inputStatus === FORM_STATUS.error ? (
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
                    {firstName.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#first-name">First Name Error</a>
                      </li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
                    {lastName.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#last-name">Last Name Error</a>
                      </li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
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
          </>
        ) : null}
        <Spacer axis="vertical" size="30" />
        <form id="submit-form" onSubmit={(e) => submitEdit(e)}>
          <InputContainer>
            <label htmlFor="first-name">First Name:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="text"
              autoComplete="given-name"
              id="first-name"
              name="first-name"
              data-input
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
          <Spacer axis="vertical" size="20" />
          <InputContainer>
            <label htmlFor="last-name">Last Name:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="text"
              autoComplete="family-name"
              id="last-name"
              name="last-name"
              data-input
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

          <Spacer axis="vertical" size="30" />
          <ImageBox setImageChange={setImage} />
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
              type="text"
              autoComplete="organization-title"
              id="title"
              name="title"
              data-input
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

  .info-group {
    .image-container {
      img {
        width: 125px;
        height: 125px;

        @media (min-width: 500px) {
          width: 150px;
          height: 150px;
        }
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

export default PersonalInfo;
