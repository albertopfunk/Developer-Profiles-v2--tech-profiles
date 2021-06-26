import React from "react";
import styled from "styled-components";

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
          aria-label="remove current preview pic"
          onClick={removeUploadedImage}
        >
          X
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
          aria-label="remove current avatar"
          onClick={removeSelectedAvatar}
        >
          X
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
          aria-label="remove saved pic on submit"
          onClick={removeSavedUserImage}
        >
          X
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
          aria-label="remove saved avatar on submit"
          onClick={removeSavedAvatar}
        >
          X
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

  button {
    border: solid;
    align-self: flex-end;
  }
`;

export default ImagePreview;
