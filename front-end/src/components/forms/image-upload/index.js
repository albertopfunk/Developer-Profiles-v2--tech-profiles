import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { FORM_STATUS } from "../../../global/helpers/variables";

function ImageUploadForm({ imageInput, setImageInput }) {
  const { setPreviewImg, user } = useContext(ProfileContext);
  const [imageStatus, setImageStatus] = useState(FORM_STATUS.idle);

  let imageRef = React.createRef();
  let imageRemovalRef = React.createRef();

  // removing unused preview image on unmount caused bugs
  // current fix is using local storage to remove on mount
  useEffect(() => {
    if (localStorage.getItem("image_id")) {
      let id = localStorage.getItem("image_id");
      localStorage.removeItem("image_id");
      httpClient("POST", "/api/delete-image", {
        id,
      });
    }
    return () => {
      setPreviewImg({ image: "", id: "" });
    };
  }, [setPreviewImg]);

  function removePreviewImageFromCloudinary() {
    if (imageInput.id) {
      httpClient("POST", "/api/delete-image", {
        id: imageInput.id,
      });
    }
  }

  async function uploadImage(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    imageRef.current.value = "";

    setImageStatus(FORM_STATUS.loading);
    const [res, err] = await httpClient("POST", "/api/upload-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setImageStatus(FORM_STATUS.error);
      return;
    }

    setImageStatus(FORM_STATUS.success);
    removePreviewImageFromCloudinary();
    localStorage.setItem("image_id", res.data.id);
    setPreviewImg(res.data);
    setImageInput({
      ...res.data,
      inputChange: true,
      shouldRemoveUserImage: false,
    });
  }

  function removePreviewImage() {
    setImageStatus(FORM_STATUS.idle);
    removePreviewImageFromCloudinary();
    localStorage.removeItem("image_id");
    setPreviewImg({ image: "", id: "" });
    setImageInput({
      image: "",
      id: "",
      inputChange: false,
      shouldRemoveUserImage: false,
    });
  }

  function setImageToRemove() {
    if (imageRemovalRef.current && imageRemovalRef.current.checked) {
      setImageInput({ ...imageInput, shouldRemoveUserImage: true });
    } else {
      setImageInput({ ...imageInput, shouldRemoveUserImage: false });
    }
  }

  console.log("-- Image Upload --");

  return (
    <div>
      <InputContainer>
        <label htmlFor="image-upload">Profile Pic:</label>
        <input
          type="file"
          id="image-upload"
          ref={imageRef}
          name="image-upload"
          aria-label="profile pic upload"
          aria-describedby="image-loading image-error image-success"
          aria-invalid={imageStatus === FORM_STATUS.error}
          onChange={(e) => uploadImage(e)}
        />

        {imageStatus === FORM_STATUS.loading ? (
          <span id="image-loading" className="loading-mssg">
            Loading...
          </span>
        ) : null}

        {imageStatus === FORM_STATUS.error ? (
          <span id="image-error" className="err-mssg">
            Error uploading profile pic. Please try again.
          </span>
        ) : null}

        {imageStatus === FORM_STATUS.success ? (
          <span id="image-success" className="success-mssg">
            Success!
          </span>
        ) : null}
      </InputContainer>
      {user.image || imageInput.image ? (
        <ImageContainer>
          <div className="img-action">
            {imageInput.image ? (
              <button
                aria-label="click to remove current profile pic preview"
                onClick={removePreviewImage}
              >
                X
              </button>
            ) : (
              <input
                type="checkbox"
                id="remove-image"
                name="remove-image"
                aria-label="check to remove profile pic on submit"
                ref={imageRemovalRef}
                onChange={setImageToRemove}
              />
            )}
          </div>

          <img
            src={imageInput.image || user.image}
            alt={
              imageInput.image ? "current profile pic preview" : "profile pic"
            }
            height="200px"
            width="200px"
          />
        </ImageContainer>
      ) : null}
    </div>
  );
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  .loading-mssg {
    color: green;
    font-size: 0.7rem;
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

const ImageContainer = styled.div`
  height: 200px;
  width: 200px;
  .img-action {
    position: absolute;
    top: 5%;
    right: 5%;
    border: solid;
    z-index: 5;
  }
`;

export default ImageUploadForm;
