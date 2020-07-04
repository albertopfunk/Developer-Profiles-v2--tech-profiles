import React, { useState, useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import ImageUploadForm from "../../../components/forms/image-upload";
import { validateInput } from "../../../global/helpers/validation";

/*

see if you can describe the form
"inputs are validated, but not required"

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
        if (value && !validateInput("name", value)) {
          console.log("validation error");
          setFirstName({ ...firstName, inputError: true });
        } else {
          setFirstName({ ...firstName, inputError: false });
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

  if (loadingUser) {
    // maybe make this a skeleton loader
    return <h1>Loading...</h1>;
  }

  if (!editInputs) {
    return (
      <section>
        <h1>Edit Inputs</h1>
        <button onClick={onEditInputs}>Edit</button>
      </section>
    );
  }

  return (
    <Section>
      <h2>User Personal Info</h2>

      <form onSubmit={e => submitEdit(e)}>
        <InputContainer>
          <label htmlFor="first-name">First Name:</label>
          <input
            type="text"
            autoComplete="given-name"
            inputMode="text"
            id="first-name"
            name="first-name"
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
              Name can only be alphabelical characters, no numbers
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

        <button>Submit</button>
      </form>
    </Section>
  );
}

const Section = styled.section`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default PersonalInfo;
