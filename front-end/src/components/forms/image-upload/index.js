import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { FORM_STATUS } from "../../../global/helpers/variables";


/*

FIRST TIME UPLOAD

user uploads preview image
  - save preview img to parent state and context(uploadImage())
  - uploads to cloudinary w name+unique chars(uploadImage())

  user uploads preview image again
    - save preview img to parent state and context(uploadImage())
    - delete old preview image(useEffect cleanup)
    - repeat

  user clicks cancel on form or user leaves page
    - delete current preview image(useeffect unmount)
    - remove state and context(useeffect for context unmount)

  user saves information
    - save info db
    - remove context(useeffect for context)



UPLOAD WITH IMAGE SAVED DB

user uploads preview image 
  - save preview id to state and context

  user uploads preview image again
    - same
  
  user clicks cancel on form or user leaves page
    - same
  
  user saves information
    - delete current db user image
    - save new info to db
    - no need to remove context since they will be the same

*/



function ImageUploadForm({
  previewImage,
  previewImageId,
  userImage,
  setImageInput,
  removeImageInput,
  removeUserImage,
  submitSuccess
}) {
  const { setPreviewImg } = useContext(ProfileContext)
  const [imageStatus, setImageStatus] = useState(FORM_STATUS.idle);

  const imageInputRef = React.createRef();
  const removeImageInputRef = React.createRef();
  let focusOnImageInputRef = useRef();


  useEffect(() => {
    return () => {
      setPreviewImg({ image: "", id: "" });
    };
  }, [setPreviewImg]);


  useEffect(() => {
    console.log("!!! SET TO CLEANUP !!!", submitSuccess, previewImageId)
    return () => {
      console.log("!!! CLEANUP !!!", submitSuccess, previewImageId)
      if (!submitSuccess && previewImageId) {
        httpClient("POST", "/api/delete-image", {
          id: previewImageId,
        });
      }
    };
  }, [previewImageId, submitSuccess]);


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
    setPreviewImg({ ...res.data });
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
    setPreviewImg({ image: "", id: "" });
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
