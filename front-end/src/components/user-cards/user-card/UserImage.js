import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as FallbackAvatar } from "../../../global/assets/fallback-avatar.svg";

function UserImage({ previewImage, userImage, avatarImage, userId }) {
  const [imageErr, setImageErr] = useState(false);

  function handleBrokenLink() {
    setImageErr(true);
  }

  if (previewImage && !imageErr) {
    return (
      <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
        <h4 id={`profile-${userId}-image-header`} className="sr-only">
          profile pic
        </h4>
        <div className="image-container">
          <img
            src={previewImage}
            onError={handleBrokenLink}
            alt="current pic preview"
          />
        </div>
      </ImageSection>
    );
  }

  if (userImage && !imageErr) {
    return (
      <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
        <h4 id={`profile-${userId}-image-header`} className="sr-only">
          profile pic
        </h4>
        <div className="image-container">
          <img
            src={userImage}
            onError={handleBrokenLink}
            alt="saved profile pic"
          />
        </div>
      </ImageSection>
    );
  }

  if (avatarImage && !imageErr) {
    return (
      <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
        <h4 id={`profile-${userId}-image-header`} className="sr-only">
          profile pic
        </h4>
        <div className="image-container">
          <img
            src={avatarImage}
            onError={handleBrokenLink}
            alt="saved avatar pic"
          />
        </div>
      </ImageSection>
    );
  }

  return (
    <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
      <h4 id={`profile-${userId}-image-header`} className="sr-only">
        profile pic
      </h4>
      <div className="image-container">
        <FallbackAvatar />
      </div>
    </ImageSection>
  );
}

const ImageSection = styled.section`
  width: 100%;
  height: 100%;
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  place-self: center;

  @media (min-width: 950px) {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .image-container {
    width: 100%;
    max-width: 200px;
    height: 100%;
    max-height: 200px;
    border-radius: 50%;
    margin: 0 auto;

    @media (min-width: 500px) {
      max-width: 250px;
      max-height: 250px;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
`;

export default UserImage;
