import React, { useState, useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../components/http-requests";
import ImageUploadForm from "../../../components/image-uploads/ImageUploadForm";

function PersonalInfo() {
  const { loadingUser, user, editProfile, setPreviewImg } = useContext(
    ProfileContext
  );

  const [imageInput, setImageInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [publicEmailInput, setPublicEmailInput] = useState("");
  const [areaOfWorkInput, setAreaOfWorkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");

  async function submitEdit(e) {
    e.preventDefault();

    if (
      !firstNameInput &&
      !lastNameInput &&
      !imageInput &&
      !publicEmailInput &&
      !areaOfWorkInput &&
      !titleInput
    ) {
      return;
    }

    const inputs = {};
    if (firstNameInput) {
      inputs.first_name = firstNameInput;
      setFirstNameInput("");
    }

    if (lastNameInput) {
      inputs.last_name = lastNameInput;
      setLastNameInput("");
    }

    if (imageInput) {
      if (user.image) {
        let imageToDelete = user.image;
        imageToDelete = imageToDelete.split(",");
        httpClient("POST", "/api/delete-image", {
          id: imageToDelete[1]
        });
      }

      inputs.image = imageInput;
      localStorage.removeItem("img_prev");
      setPreviewImg("");
      setImageInput("");
    }

    if (publicEmailInput) {
      inputs.public_email = publicEmailInput;
      setPublicEmailInput("");
    }

    if (areaOfWorkInput) {
      inputs.area_of_work = areaOfWorkInput;
      setAreaOfWorkInput("");
    }

    if (titleInput) {
      inputs.desired_title = titleInput;
      setTitleInput("");
    }

    editProfile(inputs);
  }

  console.log("===PERSONAL INFO + IMG INPUTTTT===", imageInput);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h2>User Personal Info Display</h2>
      <p>{user.first_name}</p>
      <p>{user.last_name}</p>
      <p>{user.public_email}</p>
      <p>{user.area_of_work}</p>
      <p>{user.desired_title}</p>

      <form onSubmit={e => submitEdit(e)}>
        <input
          type="text"
          placeholder="First Name"
          value={firstNameInput}
          onChange={e => setFirstNameInput(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Last Name"
          value={lastNameInput}
          onChange={e => setLastNameInput(e.target.value)}
        />

        <br />
        <br />
        <br />

        <ImageUploadForm
          setImageInput={setImageInput}
          imageInput={imageInput}
        />

        <br />
        <br />
        <br />

        <input
          type="text"
          placeholder="Public Email"
          value={publicEmailInput}
          onChange={e => setPublicEmailInput(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Area of Work"
          value={areaOfWorkInput}
          onChange={e => setAreaOfWorkInput(e.target.value)}
        />
        <select name="area_of_work" id="area_of_work">
          <option value="Development">Development</option>
          <option value="iOS">iOS</option>
          <option value="Android">Android</option>
          <option value="Design">Design</option>
        </select>

        <br />

        <input
          type="text"
          placeholder="Title"
          value={titleInput}
          onChange={e => setTitleInput(e.target.value)}
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
