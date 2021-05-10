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
        <img
          src={previewImage}
          onError={handleBrokenLink}
          alt="current pic preview"
        />
      </ImageSection>
    );
  }

  if (userImage && !imageErr) {
    return (
      <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
        <h4 id={`profile-${userId}-image-header`} className="sr-only">
          profile pic
        </h4>
        <img
          src={userImage}
          onError={handleBrokenLink}
          alt="saved profile pic"
        />
      </ImageSection>
    );
  }

  if (avatarImage && !imageErr) {
    return (
      <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
        <h4 id={`profile-${userId}-image-header`} className="sr-only">
          profile pic
        </h4>
        <img
          src={avatarImage}
          onError={handleBrokenLink}
          alt="saved avatar pic"
        />
      </ImageSection>
    );
  }

  return (
    <ImageSection aria-labelledby={`profile-${userId}-image-header`}>
      <h4 id={`profile-${userId}-image-header`} className="sr-only">
        profile pic
      </h4>
      <FallbackAvatar
        viewBox="165 226 670 740"
        preserveAspectRatio="xMidYMid meet"
      />
    </ImageSection>
  );
}

const ImageSection = styled.section`
  width: 250px;
  height: auto;
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  place-self: center;

  @media (min-width: 1050px) {
    width: 350px;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
`;

export default UserImage;
