import React from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

import IconButton from "../buttons/IconButton";

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
        <IconButton
          type="button"
          size="sm"
          classNames="close-button"
          icon={<RemoveIcon className="icon" />}
          onClick={removeUploadedImage}
        >
          <span className="visually-hidden-relative">
            remove current preview pic
          </span>
        </IconButton>
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
        <IconButton
          type="button"
          size="sm"
          classNames="close-button"
          icon={<RemoveIcon className="icon" />}
          onClick={removeSelectedAvatar}
        >
          <span className="visually-hidden-relative">
            remove current avatar
          </span>
        </IconButton>
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
        <IconButton
          type="button"
          size="sm"
          classNames="close-button"
          icon={<RemoveIcon className="icon" />}
          onClick={removeSavedUserImage}
        >
          <span className="visually-hidden-relative">
            remove saved image on submit
          </span>
        </IconButton>
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
        <IconButton
          type="button"
          size="sm"
          classNames="close-button"
          icon={<RemoveIcon className="icon" />}
          onClick={removeSavedAvatar}
        >
          <span className="visually-hidden-relative">
            remove saved avatar on submit
          </span>
        </IconButton>
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
  }
`;

export default ImagePreview;
