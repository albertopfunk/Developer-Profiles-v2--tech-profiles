import React from "react";
import styled from "styled-components";

/*

should only accept a preview image and main image
preview image can be either the avatar preview image or upload preview image
main image can be the saved profile image or saved avatar image
if both are not present then return an empty box to show that
no image is uploaded and the default image will be used

*/

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
        <div className="img-action">
          <button
            type="button"
            aria-label="remove current preview pic"
            onClick={removeUploadedImage}
          >
            X
          </button>
        </div>
        <img
          src={uploadedImage}
          alt="current preview pic"
          height="200px"
          width="200px"
        />
      </ImageContainer>
    );
  }

  if (selectedAvatar) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove current avatar"
            onClick={removeSelectedAvatar}
          >
            X
          </button>
        </div>
        <img
          src={selectedAvatar}
          alt="current avatar"
          height="200px"
          width="200px"
        />
      </ImageContainer>
    );
  }

  if (savedUserImage) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove saved pic on submit"
            onClick={removeSavedUserImage}
          >
            X
          </button>
        </div>
        <img
          src={savedUserImage}
          alt="saved pic"
          height="200px"
          width="200px"
        />
      </ImageContainer>
    );
  }

  if (savedAvatar) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove saved avatar on submit"
            onClick={removeSavedAvatar}
          >
            X
          </button>
        </div>
        <img
          src={savedAvatar}
          alt="saved avatar"
          height="200px"
          width="200px"
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
  height: 200px;
  width: 200px;
  .img-action {
    position: absolute;
    top: 5%;
    right: 5%;
    border: solid;
    z-index: 15;
  }
`;

export default ImagePreview;
