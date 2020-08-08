import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import styled from "styled-components";

function ImageUploadForm({ imageInput, setImageInput }) {
  const { setPreviewImg, user } = useContext(ProfileContext);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);

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
    setImageLoading(true);
    setImageError(false);
    setImageSuccess(false);

    const [res, err] = await httpClient("POST", "/api/upload-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setImageLoading(false);
      setImageError(true);
      setImageSuccess(false);
      return;
    }

    removePreviewImageFromCloudinary();
    localStorage.setItem("image_id", res.data.id);
    setPreviewImg(res.data);
    setImageInput({
      ...res.data,
      inputChange: true,
      shouldRemoveUserImage: false,
    });
    setImageLoading(false);
    setImageError(false);
    setImageSuccess(true);
  }

  function removePreviewImage() {
    removePreviewImageFromCloudinary();
    localStorage.removeItem("image_id");
    setPreviewImg({ image: "", id: "" });
    setImageInput({
      image: "",
      id: "",
      inputChange: false,
      shouldRemoveUserImage: false,
    });
    setImageLoading(false);
    setImageError(false);
    setImageSuccess(false);
  }

  function setImageToRemove() {
    if (imageRemovalRef.current && imageRemovalRef.current.checked) {
      setImageInput({ ...imageInput, shouldRemoveUserImage: true });
    } else {
      setImageInput({ ...imageInput, shouldRemoveUserImage: false });
    }
  }

  console.log("=====IMAGEUPLOADFORM + IMG INPUTTTT=====", imageInput);

  return (
    <div>
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
          onChange={(e) => uploadImage(e)}
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
      {user.image || imageInput.image ? (
        <div style={{ height: "200px", width: "200px" }}>
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "5%",
              border: "solid",
              zIndex: "1",
            }}
          >
            {imageInput.image ? (
              <button onClick={removePreviewImage}>X</button>
            ) : (
              <label htmlFor="remove-image">
                <input
                  type="checkbox"
                  id="remove-image"
                  name="remove-image"
                  ref={imageRemovalRef}
                  onChange={setImageToRemove}
                />
              </label>
            )}
          </div>

          <img
            style={{ height: "200px", width: "200px" }}
            src={imageInput.image || user.image}
            alt="current profile pic"
          />
        </div>
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

export default ImageUploadForm;
