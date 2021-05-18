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
  position: relative;
  width: 120px;
  height: auto;

  @media (min-width: 350px) {
    width: 175px;
  }
  
  button {
    position: absolute;
    top: 0;
    right: 0;
    border: solid;
    z-index: 15;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

export default ImagePreview;
