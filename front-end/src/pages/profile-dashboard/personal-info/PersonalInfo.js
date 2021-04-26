import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import ImageUploadForm from "../../../components/forms/images/ImageUpload";
/*

IMAGE_STATES


Starting
status - idle

new users will start with
profile_img: null
avatar_img: null
userImage default SVG should show
previewImg, avatarImg = ""




status - active

upload image or select avatar
any update on this will need to be submitted to be saved

upload image
select avatar disabled
uploads preview image
preview image shows
previewImg=previewImg

select avatar
upload image still available
only select avatar will become disabled automatically when user has a profile_image or preview image
upload image should stay available for convinience
avatarImg=avatarImg





status - success

image uploaded and saved
previewImg, avatarImg = ""
profile_image should show

avatar selected and saved
previewImg, avatarImg = ""
avatar_image should show

cancel
go back to starting







status - idle

profile_img: img
or
avatar_img: img

previewImg, avatarImg = ""








status - active

upload image or select avatar
any update on this will need to be submitted to be saved



hasAvatarImage

select avatar
avatarImg=avatarImg
first option should say 'default avatar'
this will set avatarImg="" and avatar_img="" on submit, leaving default SVG to show
user can select that or another avatar to save

upload image
previewImg=previewImg
previewImg should show since it is priority above avatarImg
user can remove previewImg -- previewImg="" and avatarImg should show again



hasProfileImage

select avatar
avatarImg=avatarImg
avatar should show
profile image will be set to remove on submit to be replc by avatar

upload image
previewImg=previewImg
preview image should show
user can remove previewImg -- previewImg="" and profile image should show again





+

preview image functionality should be moved up
image upload should only worry about uploading and removing images










------------------------------

grid scroll container
first item - image upload
other items - field set with checkboxes(similar to area of work)
below that can be the image preview
if user uploads image then preview image shows
if user removes preview image and checks avatar then avatar will show
if user has avatar saved in db then that avatar will be automatically selected
if user has profile image then it will show if no preview image selected
if remove user image checkbox is checked then user can choose an avatar to replace
if user unchecks remove on submit then avatars will be disabled

move preview image UI up
maybe have a imageUpload and imagePreview component like the kent c dodds article







------NEW USER------

START

// can be null or prefilled
user.profile_image = null
user.avatar_image = null

// these states should always start at default
previewImgInput.
  imageUpload: "",
  imageAvatar: "",
  inputChange: false,
  removeUserImage: false,
-

context.avatarImage = ""
context.previewImage = ""

---




UPLOAD IMAGE

// this will disable avatars(via imageUpload or previewImage)
// can submit
previewImgInput.
  imageUpload: "IMAGE",
  imageAvatar: "",
  inputChange: TRUE,
  removeUserImage: false,
-

context.avatarImage = ""
context.previewImage = "IMAGE"



    REMOVE PREVIEW IMAGE

    // this will enable avatars(via default state)
    // no submit
    previewImgInput.
      imageUpload: "",
      imageAvatar: "",
      inputChange: FALSE,
      removeUserImage: false,
    -

    context.avatarImage = ""
    context.previewImage = ""

---




CHOOSE AVATAR

// user can still upload an image
// can submit
previewImgInput.
  imageUpload: "",
  imageAvatar: "IMAGE",
  inputChange: TRUE,
  removeUserImage: false,
-

context.avatarImage = "IMAGE"
context.previewImage = ""


      CHOOSE DIFFERENT AVATAR
      same



      UPLOAD IMAGE

      // chosen avatar should stay the same
      // uploaded prev image will take precedent
      // this will disable avatars(via imageUpload or previewImage)
      // submit will submit both uploaded image and chosen avatar
      previewImgInput.
        imageUpload: "IMAGE",
        imageAvatar: "IMAGE",
        inputChange: TRUE,
        removeUserImage: false,
      -

      context.avatarImage = "IMAGE"
      context.previewImage = "IMAGE"


            *REMOVE PREVIEW IMAGE
            // this case should not make inputChange: FALSE
            // user should be able to submit avatar change
            previewImgInput.
              imageUpload: "",
              imageAvatar: "IMAGE",
              inputChange: TRUE,
              removeUserImage: false,
            -

            context.avatarImage = "IMAGE"
            context.previewImage = ""


---


















*/

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";
import ImagePreview from "../../../components/forms/images/ImagePreview";

let formSuccessWait;
function PersonalInfo() {
  const { user, editProfile, setPreviewImg, setAvatarImg } = useContext(
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

  const [previewImgInput, setPreviewImgInput] = useState({
    imageUpload: "",
    imageAvatar: "",
    inputChange: false,
    removeUserImage: false,
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
  
  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);




  useEffect(() => {
    if (formStatus === FORM_STATUS.idle) {
      setPreviewImg("");
      setAvatarImg("");
    }

    return () => {
      setPreviewImg("");
      setAvatarImg("");
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

    setPreviewImgInput({
      imageUpload: "",
      imageAvatar: "",
      inputChange: false,
      removeUserImage: false,
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







  function setAvatarImage(value) {

    // if checked return
    // if checked === user.avatar_image return

    const urlStart =
      "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";
    setAvatarImg(`${urlStart}${value}.svg`);
    setPreviewImgInput({
      ...previewImgInput,
      imageAvatar: `${urlStart}${value}.svg`,
      inputChange: true,
    });
  }




  function setImageInput(image) {
    setPreviewImg(image);
    setPreviewImgInput({
      ...previewImgInput,
      imageUpload: image,
      inputChange: true,
      removeUserImage: false,
    });
  }


  // should not remove both
  // send arguments to differentiate
  // if removing avatar prev, then defaultChecked should apply
  function removeImageInput() {
    const {imageAvatar} = previewImgInput;
    setPreviewImg("");
    setAvatarImg("");
    setPreviewImgInput({
      ...previewImgInput,
      imageUpload: "",
      imageAvatar: "",
      inputChange: imageAvatar ? true : false,
      removeUserImage: false,
    });
  }



  function removeUserImage(shouldRemove) {
    const {imageAvatar} = previewImgInput;
    if (shouldRemove) {
      setPreviewImgInput({
        ...previewImgInput,
        removeUserImage: true,
        inputChange: true,
      });
    } else {
      setPreviewImgInput({
        ...previewImgInput,
        removeUserImage: false,
        inputChange: imageAvatar ? true : false,

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

    // submit avatar image
    // submit preview image
    // submit avatar change
    // remove user image
    // remove user image + submit preview image
    // remove user image + submit avatar image
    // remove user image + submit avatar change

    if (previewImgInput.inputChange) {
      inputs.avatar_image = previewImgInput.imageAvatar;

      if (previewImgInput.removeUserImage) {
        inputs.profile_image = "";
      }

      if (previewImgInput.imageUpload) {
        const [res, err] = await httpClient("POST", `/api/upload-main-image`, {
          imageUrl: previewImgInput.imageUpload,
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
                  setImageInput={setImageInput}
                />
                <ImagePreview
                  previewImage={
                    previewImgInput.imageUpload || previewImgInput.imageAvatar
                  }
                  removePreviewImage={removeImageInput}
                  userImage={user.profile_image || user.avatar_image}
                  removeUserImage={removeUserImage}
                />
              </div>

              <fieldset
                disabled={
                  previewImgInput.imageUpload ||
                  (user.profile_image && !previewImgInput.removeUserImage)
                }
              >
                <legend>Choose an avatar image:</legend>

                {/* avatars main container */}
                <div className="flex-container">
                  <div className="flex-item">
                    <label htmlFor="blue-1">
                      <input
                        type="radio"
                        name="profile-avatar"
                        id="blue-1"
                        value="blue-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/blue-1.svg"
                        }
                        onClick={(e) => setAvatarImage(e.target.value)}
                      />
                      Blue female avatar, medium skin tone, pink hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="redblue-1">
                      <input
                        type="radio"
                        name="profile-avatar"
                        id="redblue-1"
                        value="redblue-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/redblue-1.svg"
                        }
                        onClick={(e) => setAvatarImage(e.target.value)}
                      />
                      Red and blue female avatar, light skin tone, red hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="whitegreen-1">
                      <input
                        type="radio"
                        name="profile-avatar"
                        id="whitegreen-1"
                        value="whitegreen-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/whitegreen-1.svg"
                        }
                        onClick={(e) => setAvatarImage(e.target.value)}
                      />
                      White and green male avatar, dark skin tone, black hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="greenblack-1">
                      <input
                        type="radio"
                        name="profile-avatar"
                        id="greenblack-1"
                        value="greenblack-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/greenblack-1.svg"
                        }
                        onClick={(e) => setAvatarImage(e.target.value)}
                      />
                      green and black female avatar, medium skin tone, black
                      hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="white-1">
                      <input
                        type="radio"
                        name="profile-avatar"
                        id="white-1"
                        value="white-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/white-1.svg"
                        }
                        onClick={(e) => setAvatarImage(e.target.value)}
                      />
                      White male avatar, light skin tone, blue hair
                    </label>
                  </div>
                  <div className="flex-item">
                    <label htmlFor="greenwhite-1">
                      <input
                        type="radio"
                        name="profile-avatar"
                        id="greenwhite-1"
                        value="greenwhite-1"
                        defaultChecked={
                          user.avatar_image ===
                          "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/greenwhite-1.svg"
                        }
                        onClick={(e) => setAvatarImage(e.target.value)}
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
