import React, { useState } from "react";
import styled from "styled-components";
import { httpClient } from "../../../global/helpers/http-requests";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

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
    </div>
  );
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  input {
    border: solid;
    width: 100px;
  }

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

export default ImageUploadForm;
