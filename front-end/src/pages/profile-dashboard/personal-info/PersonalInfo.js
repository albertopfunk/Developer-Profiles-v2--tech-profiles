import React, { useState, useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import ImageUploadForm from "../../../components/forms/image-upload";
import { validateInput } from "../../../global/helpers/validation";
import { Helmet } from "react-helmet";

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


FIRST NAME
input
change
validation error

const [firstName, setFirstName] = useState({
  input: "",
  inputChange: false,
  inputError: false
})

inputChange = true => onInputChange && if input !== user.inputName
inputChange = false => default, input === user.inputName

inputError = true => inputValue !== validated && inputValue !== ""
inputError = false => default, inputValue === validated || inputValue === ""



LAST NAME INPUT
input
change
validation error




!VALIDATION

FIRST NAME
only allow alphabetical characters
no numbers, symbols, special chars

LAST NAME
only allow alphabetical characters
no numbers, symbols, special chars



*/

function PersonalInfo() {
  const { loadingUser, user, editProfile, setPreviewImg } = useContext(
    ProfileContext
  );

  const [lastNameInput, setLastNameInput] = useState("");
  const [imageInput, setImageInput] = useState({ image: "", id: "" });
  const [areaOfWorkInput, setAreaOfWorkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [editInputs, setEditInputs] = useState(false);
  const [inputChanges, setInputChanges] = useState({
    firstName: false,
    lastName: false,
    image: false,
    areaOfWork: false,
    title: false
  });
  const [firstName, setFirstName] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });

  // imageInput is the preview image so default should be ""
  // area of work select value default should also be ""
  function onEditInputs() {
    setEditInputs(true);
    setFirstName({
      inputValue: user.first_name || "",
      inputChange: false,
      inputError: false
    });

    setLastNameInput(user.last_name || "");
    setImageInput({ image: "", id: "" });
    setAreaOfWorkInput("");
    setTitleInput(user.desired_title || "");

    setInputChanges({
      firstName: false,
      lastName: false,
      image: false,
      areaOfWork: false,
      title: false
    });
  }

  function validateOnBlur(id, value) {
    console.log(id);
    switch (id) {
      case "first-name":
        if (!firstName.inputChange) return;
        if (value.trim() === "") {
          setFirstName({ ...firstName, inputValue: "", inputError: false });
        } else if (validateInput("name", value)) {
          setFirstName({ ...firstName, inputError: false });
        } else {
          setFirstName({ ...firstName, inputError: true });
        }
        break;
      default:
        console.log("none");
    }
  }

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

  function onLastNameInputChange(value) {
    if (!inputChanges.lastName) {
      setInputChanges({ ...inputChanges, lastName: true });
    }
    setLastNameInput(value);
  }

  function onImageInputChange(value) {
    if (!inputChanges.image) {
      setInputChanges({ ...inputChanges, image: true });
    }
    setImageInput(value);
  }

  function removeImage() {
    if (!inputChanges.image) {
      setInputChanges({ ...inputChanges, image: true });
    }
    console.log("removeeeee");
    // should not remove on the spot
    // should set the image to remove
    // UI that tells user this image will be removed,
    // preview image will replace UI if user chooses another image after removing current
  }

  function onAreaOfWorkInputChange(value) {
    // when user selects default value, indicates no change
    if (!value) {
      setInputChanges({ ...inputChanges, areaOfWork: false });
      return;
    }

    if (!inputChanges.areaOfWork) {
      setInputChanges({ ...inputChanges, areaOfWork: true });
    }
    setAreaOfWorkInput(value);
  }

  function onTitleInputChange(value) {
    if (!inputChanges.title) {
      setInputChanges({ ...inputChanges, title: true });
    }
    setTitleInput(value);
  }

  function submitEdit(e) {
    e.preventDefault();

    if (
      !firstName.inputChange &&
      !inputChanges.lastName &&
      !inputChanges.image &&
      !inputChanges.areaOfWork &&
      !inputChanges.title
    ) {
      return;
    }

    const inputs = {};

    if (firstName.inputChange) {
      inputs.first_name = firstName.inputValue;
    }

    if (inputChanges.lastName) {
      inputs.last_name = lastNameInput;
    }

    if (inputChanges.image) {
      if (imageInput.id !== user.image_id) {
        if (user.image_id) {
          httpClient("POST", "/api/delete-image", {
            id: user.image_id
          });
        }

        inputs.image = imageInput.image;
        inputs.image_id = imageInput.id;
        localStorage.removeItem("image_id");
        setPreviewImg({ image: "", id: "" });
      }
    }

    if (inputChanges.areaOfWork) {
      inputs.area_of_work = areaOfWorkInput;
    }

    if (inputChanges.title) {
      inputs.desired_title = titleInput;
    }

    console.log("SUB", inputs);
    setEditInputs(false);
    editProfile(inputs);
  }

  function resetInputs() {
    setEditInputs(false);
  }

  if (loadingUser) {
    // maybe make this a skeleton loader
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
    <main aria-labelledby="personal-info-heading-1">
      <Helmet>
        <title>Dashboard Personal Info | Tech Profiles</title>
      </Helmet>
      <h1 id="personal-info-heading-1">Personal Info</h1>

      <section aria-labelledby="personal-info-heading-2">
        <h2 id="personal-info-heading-2">Edit Information</h2>
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
              aria-labelledby="first-name-label"
              aria-describedby="nameError"
              aria-invalid={firstName.inputError}
              value={firstName.inputValue}
              onChange={e => onFirstNameInputChange(e.target.value)}
              onBlur={e => validateOnBlur(e.target.id, e.target.value)}
            />
            {firstName.inputError ? (
              <span
                id="nameError"
                className="err-mssg"
                aria-live="polite"
                style={{
                  fontSize: "12px",
                  color: "red"
                }}
              >
                First Name can only be alphabelical characters, no numbers
              </span>
            ) : null}
          </InputContainer>

          <br />

          <input
            type="text"
            placeholder="Last Name"
            value={lastNameInput}
            onChange={e => onLastNameInputChange(e.target.value)}
          />

          <br />
          <br />
          <br />

          <div>
            {user.image || imageInput.image ? (
              <div style={{ height: "200px", width: "200px" }}>
                {!imageInput.image ? (
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
                  src={imageInput.image || user.image}
                  alt="current profile pic"
                />
              </div>
            ) : null}

            <ImageUploadForm
              setImageInput={onImageInputChange}
              imageInput={imageInput}
            />
          </div>

          <br />
          <br />
          <br />

          <select
            id="sorting-area_of_work"
            onClick={e => onAreaOfWorkInputChange(e.target.value)}
            onBlur={e => onAreaOfWorkInputChange(e.target.value)}
          >
            <option value="">--Select--</option>
            <option value="Development">Development</option>
            <option value="iOS">iOS</option>
            <option value="Android">Android</option>
            <option value="Design">Design</option>
          </select>

          <br />
          <br />
          <br />

          <input
            type="text"
            placeholder="Title"
            value={titleInput}
            onChange={e => onTitleInputChange(e.target.value)}
          />

          <button type="submit">Submit</button>
          <button type="reset" onClick={resetInputs}>
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default PersonalInfo;
