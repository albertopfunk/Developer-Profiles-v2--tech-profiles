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
  previewImage,
  removePreviewImage,
  avatarImage,
  removeAvatarImage,
  userImage,
  removeUserImage,
}) {

  if (previewImage) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove current preview pic"
            onClick={removePreviewImage}
          >
            X
          </button>
        </div>
        <img
          src={previewImage}
          alt="current preview pic"
          height="200px"
          width="200px"
        />
      </ImageContainer>
    );
  }

  if (avatarImage) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove current avatar"
            onClick={removeAvatarImage}
          >
            X
          </button>
        </div>
        <img
          src={avatarImage}
          alt="current avatar"
          height="200px"
          width="200px"
        />
      </ImageContainer>
    );
  }

  if (userImage) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove saved pic on submit"
            onClick={removeUserImage}
          >
            X
          </button>
        </div>
        <img src={userImage} alt="saved pic" height="200px" width="200px" />
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
