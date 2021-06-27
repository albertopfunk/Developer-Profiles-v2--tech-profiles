import React from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

function ImagePreview({
  uploadedImage,
  removeUploadedImage,
  selectedAvatar,
  removeSelectedAvatar,
  savedUserImage,
  removeSavedUserImage,
  savedAvatar,
  removeSavedAvatar,
}) {
  if (uploadedImage) {
    return (
      <ImageContainer>
        <button
          type="button"
          className="button close-button"
          aria-label="remove current preview pic"
          onClick={removeUploadedImage}
        >
          <span className="visually-hidden-relative">remove image</span>
          <span className="button-icon">
            <RemoveIcon className="icon" />
          </span>
        </button>
        <img
          src={uploadedImage}
          alt="current preview pic"
          height="130px"
          width="130px"
        />
      </ImageContainer>
    );
  }

  if (selectedAvatar) {
    return (
      <ImageContainer>
        <button
          type="button"
          className="button close-button"
          aria-label="remove current avatar"
          onClick={removeSelectedAvatar}
        >
          <span className="visually-hidden-relative">remove image</span>
          <span className="button-icon">
            <RemoveIcon className="icon" />
          </span>
        </button>
        <img
          src={selectedAvatar}
          alt="current avatar"
          height="130px"
          width="130px"
        />
      </ImageContainer>
    );
  }

  if (savedUserImage) {
    return (
      <ImageContainer>
        <button
          type="button"
          className="button close-button"
          aria-label="remove saved pic on submit"
          onClick={removeSavedUserImage}
        >
          <span className="visually-hidden-relative">remove image</span>
          <span className="button-icon">
            <RemoveIcon className="icon" />
          </span>
        </button>
        <img
          src={savedUserImage}
          alt="saved pic"
          height="130px"
          width="130px"
        />
      </ImageContainer>
    );
  }

  if (savedAvatar) {
    return (
      <ImageContainer>
        <button
          type="button"
          className="button close-button"
          aria-label="remove saved avatar on submit"
          onClick={removeSavedAvatar}
        >
          <span className="visually-hidden-relative">remove image</span>
          <span className="button-icon">
            <RemoveIcon className="icon" />
          </span>
        </button>
        <img
          src={savedAvatar}
          alt="saved avatar"
          height="130px"
          width="130px"
        />
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <p>No image uploaded</p>
    </ImageContainer>
  );
}

const ImageContainer = styled.div`
  width: 130px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .close-button {
    align-self: flex-end;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus-visible {
      outline-width: 3px;
      outline-color: transparent;
      box-shadow: inset 0 0 1px 2.5px #2727ad;
    }

    &:hover .icon {
      fill: #2727ad;
    }

    .button-icon {
      display: inline-block;

      .icon {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

export default ImagePreview;
