import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import styled from "styled-components";

function ImageUploadForm({ imageInput, setImageInput }) {
  const { setPreviewImg } = useContext(ProfileContext);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);

  let imageRef = React.createRef();

  // removing unused preview image on unmount caused bugs
  // current fix is using local storage to remove on mount
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

  async function onImageInputChange(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    imageRef.current.value = "";
    setImageLoading(true);
    setImageError(false);
    setImageSuccess(false);

    const [res, err] = await httpClient("POST", "/api/upload-image", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setImageLoading(false);
      setImageError(true);
      setImageSuccess(false);
      return;
    }

    if (imageInput.id) {
      httpClient("POST", "/api/delete-image", {
        id: imageInput.id
      });
    }

    localStorage.setItem("image_id", res.data.id);
    setPreviewImg(res.data);
    setImageInput(res.data);
    setImageLoading(false);
    setImageError(false);
    setImageSuccess(true);
  }

  console.log("=====IMAGEUPLOADFORM + IMG INPUTTTT=====", imageInput);

  return (
    <InputContainer>
      <label htmlFor="image-upload" id="image-upload-label">
        Image:
      </label>
      <input
        type="file"
        id="image-upload"
        ref={imageRef}
        name="image-upload"
        aria-labelledby="image-upload-label"
        aria-describedby="imageLoading imageError imageSuccess"
        aria-invalid={imageError}
        onChange={e => onImageInputChange(e)}
      />

      {imageLoading ? (
        <span id="imageLoading" className="loading-mssg" aria-live="polite">
          Loading...
        </span>
      ) : null}

      {imageError ? (
        <span id="imageError" className="err-mssg" aria-live="polite">
          Error uploading image. Please try again
        </span>
      ) : null}

      {imageSuccess ? (
        <span id="imageSuccess" className="success-mssg" aria-live="polite">
          Success!
        </span>
      ) : null}
    </InputContainer>
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

export default ImageUploadForm;
