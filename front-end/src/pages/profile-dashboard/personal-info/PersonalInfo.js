import React, { useState, useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import ImageUploadForm from "../../../components/forms/images/ImageUpload";
import ImagePreview from "../../../components/forms/images/ImagePreview";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function PersonalInfo() {
  const { user, editProfile, userImage, setUserImage } = useContext(
    ProfileContext
  );
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
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

  const [previewImage, setPreviewImage] = useState({
    imageUpload: "",
    selectedAvatar: "",
    inputChange: false,
    removeUserImage: false,
    removeSavedAvatar: false,
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
  let editInfoBtnRef = React.createRef();
  let firstNameInputRef = React.createRef();
  const avatarRadioRefs = useRef({
    "blue-1": React.createRef(),
    "redblue-1": React.createRef(),
    "whitegreen-1": React.createRef(),
    "greenblack-1": React.createRef(),
    "white-1": React.createRef(),
    "greenwhite-1": React.createRef(),
  });

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  useEffect(() => {
    if (formStatus === FORM_STATUS.idle) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
    }

    return () => {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
    };
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
        firstNameInputRef.current.focus();
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
    setLastName({
      inputValue: user.last_name || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });

    setPreviewImage({
      imageUpload: "",
      selectedAvatar: "",
      inputChange: false,
      removeUserImage: false,
      removeSavedAvatar: false,
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

  function setSelectedAvatar(value) {
    const urlStart =
      "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

    // no need to set saved avatar
    if (`${urlStart}${value}.svg` === user.avatar_image) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: previewImage.removeUserImage,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: "",
        inputChange: previewImage.removeUserImage,
        removeUserImage: previewImage.removeUserImage,
        removeSavedAvatar: false,
      });
      return;
    }

    setUserImage({
      ...userImage,
      previewAvatar: `${urlStart}${value}.svg`,
    });
    setPreviewImage({
      ...previewImage,
      selectedAvatar: `${urlStart}${value}.svg`,
      inputChange: true,
    });
  }

  function setImageUpload(image) {
    setUserImage({
      ...userImage,
      previewImage: image,
    });

    setPreviewImage({
      ...previewImage,
      imageUpload: image,
      inputChange: true,
    });
  }

  // top most layer, 5
  function removeUploadedImage() {
    const { selectedAvatar } = previewImage;

    // layer 4
    // fallback to selected avatar
    // remove image upload
    if (selectedAvatar) {
      setUserImage({
        ...userImage,
        previewImage: "",
      });
      setPreviewImage({
        ...previewImage,
        inputChange: true,
        imageUpload: "",
      });

      return;
    }

    // layer 3
    // fallback to user image with reset
    if (user.profile_image) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: "",
        inputChange: false,
        removeUserImage: false,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 2
    // fallback to avatar image and select correct radio with reset
    if (user.avatar_image) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      for (const avatarRadio in avatarRadioRefs.current) {
        const { value } = avatarRadioRefs.current[avatarRadio].current;
        if (user.avatar_image === `${urlStart}${value}.svg`) {
          avatarRadioRefs.current[avatarRadio].current.checked = true;
        } else {
          avatarRadioRefs.current[avatarRadio].current.checked = false;
        }
      }

      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: "",
        inputChange: false,
        removeUserImage: false,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 1
    // set selected avatar if any radio is selected
    // remove image upload
    let checkedAvatar = null;
    for (const avatarRadio in avatarRadioRefs.current) {
      if (avatarRadioRefs.current[avatarRadio].current.checked) {
        checkedAvatar = avatarRadioRefs.current[avatarRadio].current.value;
      }
    }

    if (checkedAvatar) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      setUserImage({
        previewImage: "",
        previewAvatar: `${urlStart}${checkedAvatar}.svg`,
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: `${urlStart}${checkedAvatar}.svg`,
        inputChange: true,
        removeUserImage: false,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 0, default reset
    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: false,
      removeSavedAvatar: false,
    });
    setPreviewImage({
      imageUpload: "",
      selectedAvatar: "",
      inputChange: false,
      removeUserImage: false,
      removeSavedAvatar: false,
    });
  }

  // layer 4
  function removeSelectedAvatar() {
    // layer 3
    // fallback to user image with reset
    if (user.profile_image) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: "",
        inputChange: false,
        removeUserImage: false,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 2
    // fallback to avatar image and select correct radio with reset
    if (user.avatar_image) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      console.log(avatarRadioRefs.current);
      for (const avatarRadio in avatarRadioRefs.current) {
        const { value } = avatarRadioRefs.current[avatarRadio].current;
        if (user.avatar_image === `${urlStart}${value}.svg`) {
          avatarRadioRefs.current[avatarRadio].current.checked = true;
        } else {
          avatarRadioRefs.current[avatarRadio].current.checked = false;
        }
      }

      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: "",
        inputChange: false,
        removeUserImage: false,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 1 && default
    // unselect radios with reset
    for (const avatarRadio in avatarRadioRefs.current) {
      avatarRadioRefs.current[avatarRadio].current.checked = false;
    }

    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: false,
      removeSavedAvatar: false,
    });
    setPreviewImage({
      imageUpload: "",
      selectedAvatar: "",
      inputChange: false,
      removeUserImage: false,
      removeSavedAvatar: false,
    });
  }

  // layer 3
  function removeUserImage() {
    // layer 2
    // fallback to avatar image and select correct radio with reset
    // set remove user image
    if (user.avatar_image) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      for (const avatarRadio in avatarRadioRefs.current) {
        const { value } = avatarRadioRefs.current[avatarRadio].current;
        if (user.avatar_image === `${urlStart}${value}.svg`) {
          avatarRadioRefs.current[avatarRadio].current.checked = true;
        } else {
          avatarRadioRefs.current[avatarRadio].current.checked = false;
        }
      }

      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: true,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: "",
        inputChange: true,
        removeUserImage: true,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 1
    // set selected avatar if any radio is selected
    // set remove user image
    let checkedAvatar = null;
    for (const avatarRadio in avatarRadioRefs.current) {
      if (avatarRadioRefs.current[avatarRadio].current.checked) {
        checkedAvatar = avatarRadioRefs.current[avatarRadio].current.value;
      }
    }

    if (checkedAvatar) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      setUserImage({
        previewImage: "",
        previewAvatar: `${urlStart}${checkedAvatar}.svg`,
        removeUserImage: true,
        removeSavedAvatar: false,
      });
      setPreviewImage({
        imageUpload: "",
        selectedAvatar: `${urlStart}${checkedAvatar}.svg`,
        inputChange: true,
        removeUserImage: true,
        removeSavedAvatar: false,
      });

      return;
    }

    // layer 0, default reset
    // set remove user image
    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: true,
      removeSavedAvatar: false,
    });
    setPreviewImage({
      imageUpload: "",
      selectedAvatar: "",
      inputChange: true,
      removeUserImage: true,
      removeSavedAvatar: false,
    });
  }

  // layer 2
  function removeSavedAvatar() {
    // layer 1 && default
    // unselect radios with reset
    // set remove saved avatar
    for (const avatarRadio in avatarRadioRefs.current) {
      avatarRadioRefs.current[avatarRadio].current.checked = false;
    }

    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: previewImage.removeUserImage,
      removeSavedAvatar: true,
    });
    setPreviewImage({
      imageUpload: "",
      selectedAvatar: "",
      inputChange: true,
      removeUserImage: previewImage.removeUserImage,
      removeSavedAvatar: true,
    });
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
      !previewImage.inputChange &&
      !areaOfWork.inputChange &&
      !title.inputChange
    ) {
      return;
    }

    setFormStatus(FORM_STATUS.loading);
    const inputs = {};

    if (firstName.inputChange) {
      inputs.first_name = firstName.inputValue;
    }

    if (lastName.inputChange) {
      inputs.last_name = lastName.inputValue;
    }

    if (areaOfWork.inputChange) {
      inputs.area_of_work = areaOfWork.inputValue;
    }

    if (title.inputChange) {
      inputs.desired_title = title.inputValue;
    }

    if (previewImage.inputChange) {
      if (previewImage.removeUserImage) {
        inputs.profile_image = "";
      }

      if (previewImage.removeSavedAvatar) {
        inputs.avatar_image = "";
      }

      if (previewImage.selectedAvatar) {
        inputs.avatar_image = previewImage.selectedAvatar;
      }

      if (previewImage.imageUpload) {
        const [res, err] = await httpClient("POST", `/api/upload-main-image`, {
          imageUrl: previewImage.imageUpload,
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
      setFormStatus(FORM_STATUS.idle);
      setHasSubmitError(null);
    }, 750);
    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <>
        <Helmet>
          <title>Profile Dashboard Personal Info • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Personal Info</h1>
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
            <li>First Name: {user.first_name || "None Set"}</li>
            <li>Last Name: {user.last_name || "None Set"}</li>
            <li>
              {user.profile_image || user.avatar_image ? (
                <>
                  <p>Profile Pic:</p>
                  <img
                    src={user.profile_image || user.avatar_image}
                    alt="saved pic"
                  />
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
      {formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="Successfully submitted information"
          ariaId="success-form-announcer"
        />
      ) : null}

      <FormSection aria-labelledby="edit-information-heading">
        <h2 id="edit-information-heading">Edit Information</h2>

        {formStatus === FORM_STATUS.error ? (
          <div ref={errorSummaryRef} tabIndex="-1">
            <h3 id="error-heading">Errors in Submission</h3>
            {hasSubmitError ||
            firstName.inputStatus === FORM_STATUS.error ||
            lastName.inputStatus === FORM_STATUS.error ||
            title.inputStatus === FORM_STATUS.error ? (
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
              ref={firstNameInputRef}
              type="text"
              autoComplete="given-name"
              id="first-name"
              data-main-content="true"
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

          <ImageBoxContainer>
            <div className="grid-container">
              <div className="image-upload-container">
                <ImageUploadForm
                  userId={user.id}
                  setImageInput={setImageUpload}
                />
                <ImagePreview
                  uploadedImage={previewImage.imageUpload}
                  removeUploadedImage={removeUploadedImage}
                  selectedAvatar={previewImage.selectedAvatar}
                  removeSelectedAvatar={removeSelectedAvatar}
                  savedUserImage={
                    !previewImage.removeUserImage && user.profile_image
                  }
                  removeSavedUserImage={removeUserImage}
                  savedAvatar={
                    !previewImage.removeSavedAvatar && user.avatar_image
                  }
                  removeSavedAvatar={removeSavedAvatar}
                />
              </div>

              <fieldset
                disabled={
                  previewImage.imageUpload ||
                  (user.profile_image && !previewImage.removeUserImage)
                }
              >
                <legend>Choose an avatar image:</legend>

                {/* avatars main container */}
                <div className="flex-container">
                  <div className="flex-item">
                    <label htmlFor="blue-1">
                      <input
                        ref={avatarRadioRefs.current["blue-1"]}
                        type="radio"
                        name="profile-avatar"
                        id="blue-1"
                        value="blue-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/blue-1.svg"
                        }
                        onClick={(e) => setSelectedAvatar(e.target.value)}
                      />
                      Blue female avatar, medium skin tone, pink hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="redblue-1">
                      <input
                        ref={avatarRadioRefs.current["redblue-1"]}
                        type="radio"
                        name="profile-avatar"
                        id="redblue-1"
                        value="redblue-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/redblue-1.svg"
                        }
                        onClick={(e) => setSelectedAvatar(e.target.value)}
                      />
                      Red and blue female avatar, light skin tone, red hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="whitegreen-1">
                      <input
                        ref={avatarRadioRefs.current["whitegreen-1"]}
                        type="radio"
                        name="profile-avatar"
                        id="whitegreen-1"
                        value="whitegreen-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/whitegreen-1.svg"
                        }
                        onClick={(e) => setSelectedAvatar(e.target.value)}
                      />
                      White and green male avatar, dark skin tone, black hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="greenblack-1">
                      <input
                        ref={avatarRadioRefs.current["greenblack-1"]}
                        type="radio"
                        name="profile-avatar"
                        id="greenblack-1"
                        value="greenblack-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/greenblack-1.svg"
                        }
                        onClick={(e) => setSelectedAvatar(e.target.value)}
                      />
                      green and black female avatar, medium skin tone, black
                      hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="white-1">
                      <input
                        ref={avatarRadioRefs.current["white-1"]}
                        type="radio"
                        name="profile-avatar"
                        id="white-1"
                        value="white-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/white-1.svg"
                        }
                        onClick={(e) => setSelectedAvatar(e.target.value)}
                      />
                      White male avatar, light skin tone, blue hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="greenwhite-1">
                      <input
                        ref={avatarRadioRefs.current["greenwhite-1"]}
                        type="radio"
                        name="profile-avatar"
                        id="greenwhite-1"
                        value="greenwhite-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/greenwhite-1.svg"
                        }
                        onClick={(e) => setSelectedAvatar(e.target.value)}
                      />
                      Green and white male avatar, light skin tone, black hair
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </ImageBoxContainer>

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
            onClick={resetForm}
            onKeyDown={(e) => formFocusAction(e, FORM_STATUS.idle)}
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

const ImageBoxContainer = styled.div`
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);

  .grid-container {
    display: grid;
    overflow-x: auto;
    grid-template-columns: 1fr auto;
  }

  fieldset {
    border: none;

    .flex-container {
      display: flex;
      gap: 20px;

      .flex-item {
        width: 100px;
        height: auto;
      }
    }
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
