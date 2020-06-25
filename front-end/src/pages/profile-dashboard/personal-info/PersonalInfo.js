import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../components/http-requests";
import ImageUploadForm from "../../../components/forms/image-upload";

function PersonalInfo() {
  const { loadingUser, user, editProfile, setPreviewImg } = useContext(
    ProfileContext
  );
  const [editInputs, setEditInputs] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [firstNameInputChange, setFirstNameInputChange] = useState(false);
  const [lastNameInput, setLastNameInput] = useState("");
  const [lastNameInputChange, setLastNameInputChange] = useState(false);
  const [imageInput, setImageInput] = useState({ image: "", id: "" });
  const [imageInputChange, setImageInputChange] = useState(false);
  const [publicEmailInput, setPublicEmailInput] = useState("");
  const [emailInputChange, setEmailInputChange] = useState(false);
  const [areaOfWorkInput, setAreaOfWorkInput] = useState("");
  const [areaOfWorkInputChange, setAreaOfWorkInputChange] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [titleInputChange, setTitleInputChange] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("image_id")) {
      let id = localStorage.getItem("image_id");
      localStorage.removeItem("image_id");
      httpClient("POST", "/api/delete-image", {
        id
      });
    }
    return () => {
      setPreviewImg({ image: "", id: "" });
    };
  }, [setPreviewImg]);

  // imageInput is the preview image so default should be ""
  // area of work select value default should also be ""
  function onEditInputs() {
    setEditInputs(true);
    setFirstNameInput(user.first_name || "");
    setFirstNameInputChange(false);
    setLastNameInput(user.last_name || "");
    setLastNameInputChange(false);
    setImageInput({ image: "", id: "" });
    setImageInputChange(false);
    setPublicEmailInput(user.public_email || "");
    setEmailInputChange(false);
    setAreaOfWorkInput("");
    setAreaOfWorkInputChange(false);
    setTitleInput(user.desired_title || "");
    setTitleInputChange(false);
  }

  function onFirstNameInputChange(value) {
    if (!firstNameInputChange) {
      setFirstNameInputChange(true);
    }
    setFirstNameInput(value);
  }

  function onLastNameInputChange(value) {
    if (!lastNameInputChange) {
      setLastNameInputChange(true);
    }
    setLastNameInput(value);
  }

  function onImageInputChange(value) {
    if (!imageInputChange) {
      setImageInputChange(true);
    }
    setImageInput(value);
  }

  function onEmailInputChange(value) {
    if (!emailInputChange) {
      setEmailInputChange(true);
    }
    setPublicEmailInput(value);
  }

  function onAreaOfWorkInputChange(value) {
    if (!value) {
      setAreaOfWorkInputChange(false);
      return;
    }

    if (!areaOfWorkInputChange) {
      setAreaOfWorkInputChange(true);
    }
    setAreaOfWorkInput(value);
  }

  function onTitleInputChange(value) {
    if (!titleInputChange) {
      setTitleInputChange(true);
    }
    setTitleInput(value);
  }

  async function submitEdit(e) {
    e.preventDefault();

    if (
      !firstNameInputChange &&
      !lastNameInputChange &&
      !imageInputChange &&
      !emailInputChange &&
      !areaOfWorkInputChange &&
      !titleInputChange
    ) {
      return;
    }

    const inputs = {};

    if (firstNameInputChange) {
      inputs.first_name = firstNameInput;
    }

    if (lastNameInputChange) {
      inputs.last_name = lastNameInput;
    }

    if (imageInputChange) {
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

    if (emailInputChange) {
      inputs.public_email = publicEmailInput;
    }

    if (areaOfWorkInputChange) {
      inputs.area_of_work = areaOfWorkInput;
    }

    if (titleInputChange) {
      inputs.desired_title = titleInput;
    }

    setEditInputs(false);
    editProfile(inputs);
  }

  console.log("===PERSONAL INFO + IMG INPUTTTT===", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }

  if (!editInputs) {
    return (
      <div>
        <h1>Edit Inputs</h1>
        <button onClick={onEditInputs}>Edit</button>
      </div>
    );
  }

  return (
    <Main>
      <h2>User Personal Info</h2>
      <form onSubmit={e => submitEdit(e)}>
        <input
          type="text"
          placeholder="First Name"
          value={firstNameInput}
          onChange={e => onFirstNameInputChange(e.target.value)}
        />

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

        <ImageUploadForm
          setImageInput={onImageInputChange}
          imageInput={imageInput}
        />

        <br />
        <br />
        <br />

        <input
          type="text"
          placeholder="Public Email"
          value={publicEmailInput}
          onChange={e => onEmailInputChange(e.target.value)}
        />

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
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default PersonalInfo;
