import React, { useState } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";
import { ReactComponent as UploadIcon } from "../../../global/assets/dashboard-upload.svg";

function ImageUploadForm({ userId, imageId, setImageInput }) {
  const [imageStatus, setImageStatus] = useState(FORM_STATUS.idle);
  const imageInputRef = React.createRef();

  async function uploadImage(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const url = imageId
      ? `/api/upload-preview-image/${userId}/${imageId}`
      : `/api/upload-preview-image/${userId}`;

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    imageInputRef.current.value = "";

    setImageStatus(FORM_STATUS.loading);
    const [res, err] = await httpClient("POST", url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setImageStatus(FORM_STATUS.error);
      return;
    }

    // timeout then idle
    setImageStatus(FORM_STATUS.success);
    setImageInput(res.data.image);
  }

  return (
    <div>
      <InputContainer>
        <label htmlFor="image-upload">Upload an image:</label>
        <Spacer axis="vertical" size="5" />
        <div className="input-container">
          <span className="upload-icon">
            <UploadIcon className="icon" />
          </span>
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
        </div>
        <Spacer axis="vertical" size="2" />
        {imageStatus === FORM_STATUS.loading ? (
          <span id="image-loading" className="info-mssg">
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
    </div>
  );
}

const InputContainer = styled.div`
  .input-container {
    width: 100%;
    max-width: 225px;
    position: relative;
    border: var(--border-sm);
    border-radius: var(--border-radius-sm);
    box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
    background-color: white;

    &:focus-within {
      outline: solid 2px;
      outline-offset: -1px;
    }

    &:focus-within .icon {
      fill: var(--dark-green-3);
    }

    &:hover .icon {
      fill: var(--dark-green-3);
    }

    .upload-icon {
      display: flex;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .icon {
        width: 25px;
        height: 25px;
      }
    }

    input {
      width: 100%;
      min-height: 35px;
      padding: 5px;
      opacity: 0;

      &:hover {
        cursor: pointer;
      }
    }
  }

  label {
    &:hover {
      cursor: pointer;
    }
  }

  span {
    display: block;
  }
`;

export default ImageUploadForm;
