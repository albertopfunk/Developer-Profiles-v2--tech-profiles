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
  userImage,
  removeUserImage,
}) {
  const removeImageInputRef = React.createRef();

  function removeImage() {
    removePreviewImage("");
  }

  function setUserImageToRemove() {
    if (removeImageInputRef.current && removeImageInputRef.current.checked) {
      removeUserImage(true);
    } else {
      removeUserImage(false);
    }
  }

  if (previewImage) {
    return (
      <ImageContainer>
        <div className="img-action">
          <button
            type="button"
            aria-label="remove current preview pic"
            onClick={removeImage}
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

  if (userImage) {
    return (
      <ImageContainer>
        <div className="img-action">
          <input
            type="checkbox"
            id="remove-image"
            name="remove-image"
            aria-label="remove saved pic on submit"
            ref={removeImageInputRef}
            onChange={setUserImageToRemove}
          />
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
    z-index: 5;
  }
`;

export default ImagePreview;
