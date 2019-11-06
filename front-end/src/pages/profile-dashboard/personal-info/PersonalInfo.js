import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import axios from "axios";

function PersonalInfo() {
  const { loadingUser, user, editProfile } = useContext(ProfileContext);

  const [imageDisplay, setImageDisplay] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [publicEmailInput, setPublicEmailInput] = useState("");
  const [areaOfWorkInput, setAreaOfWorkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");

  useEffect(() => {
    if (user && user.image) {
      if (!imageDisplay) {
        loadImage();
      }
    }
  });

  function loadImage() {
    console.log("IMAGEE", user.image)
    let image;
    image = user.image;
    image = image.split(",");
    setImageDisplay(image[0]);
  }

  async function uploadImage(e) {
    if (e.target.files.length === 0) {
      if (imageInput) {
        deleteOldImage(imageInput);
      }
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    const XHR = new XMLHttpRequest();
    setLoadingImage(true);

    XHR.addEventListener("load", e => {
      if (imageInput) {
        deleteOldImage(imageInput);
      }
      const { url, id } = JSON.parse(e.target.response);
      const imageInfo = `${url},${id}`;
      setImageInput(imageInfo);
      setLoadingImage(false);
      setErrorImage(false);
    });

    XHR.addEventListener("error", e => {
      console.error(e.target);
      setLoadingImage(false);
      setErrorImage(true);
    });

    XHR.open("POST", `${process.env.REACT_APP_SERVER}/api/upload-image`);
    XHR.send(data);
  }

  async function deleteOldImage(imageId) {
    let imageToDelete = imageId;
    imageToDelete = imageToDelete.split(",");

    try {
      await axios.post(`${process.env.REACT_APP_SERVER}/api/delete-image`, {
        id: imageToDelete[1]
      });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  }

  async function submitEdit(e) {
    e.preventDefault();

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
        deleteOldImage(user.image);
      }
      inputs.image = imageInput;
      let image = imageInput;
      image = image.split(",");
      setImageDisplay(image[0]);
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

  console.log("===PERSONAL INFO===", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h2>User Personal Info Display</h2>
      <img src={imageDisplay} alt="some cool thingamagig" />
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

        <input
          type="file"
          name="image-upload"
          placeholder="Upload Image"
          onChange={e => uploadImage(e)}
        />
        {loadingImage ? <p>Loading...</p> : null}
        {errorImage ? <p>Error!</p> : null}

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
          <option value="Web Development">Web Development</option>
          <option value="iOS">iOS</option>
          <option value="Android">Android</option>
          <option value="UI/UX">UI/UX</option>
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
