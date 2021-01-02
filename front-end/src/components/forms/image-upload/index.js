import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";
import { FORM_STATUS } from "../../../global/helpers/variables";

function ImageUploadForm({
  previewImage,
  userImage,
  setImageInput,
  removeImageInput,
  removeUserImage,
}) {
  const [imageStatus, setImageStatus] = useState(FORM_STATUS.idle);

  const imageInputRef = React.createRef();
  const removeImageInputRef = React.createRef();
  let focusOnImageInputRef = useRef();

  useEffect(() => {
    if (!focusOnImageInputRef.current) {
      return;
    }

    focusOnImageInputRef.current = false;
    imageInputRef.current.focus();
  });

  async function uploadImage(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    imageInputRef.current.value = "";

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
    setImageInput({ ...res.data });
  }

  function imageInputFocusAction(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    focusOnImageInputRef.current = true;
    removeImage();
  }

  function removeImage() {
    setImageStatus(FORM_STATUS.idle);
    removeImageInput({
      image: "",
      id: "",
    });
  }

  function setUserImageToRemove() {
    if (removeImageInputRef.current && removeImageInputRef.current.checked) {
      removeUserImage(true);
    } else {
      removeUserImage(false);
    }
  }

  return (
    <div>
      <InputContainer>
        <label htmlFor="image-upload">Profile Pic:</label>
        <input
          type="file"
          id="image-upload"
          ref={imageInputRef}
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
      {userImage || previewImage ? (
        <ImageContainer>
          <div className="img-action">
            {previewImage ? (
              <button
                type="button"
                aria-label="remove current preview pic"
                onClick={removeImage}
                onKeyDown={imageInputFocusAction}
              >
                X
              </button>
            ) : (
              <input
                type="checkbox"
                id="remove-image"
                name="remove-image"
                aria-label="remove saved pic on submit"
                ref={removeImageInputRef}
                onChange={setUserImageToRemove}
              />
            )}
          </div>

          <img
            src={previewImage || userImage}
            alt={previewImage ? "current preview pic" : "saved pic"}
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
