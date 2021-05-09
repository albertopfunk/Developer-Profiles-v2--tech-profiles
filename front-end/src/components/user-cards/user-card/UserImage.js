import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as FallbackAvatar } from "../../../global/assets/fallback-avatar.svg";

// in order
// render previewImg/previewAvatar if avail
// render userImg if avail
// render avatarImg if avail
// render default SVG if none avail or if imgErr

function UserImage({ previewImage, userImage, avatarImage }) {
  const [imageErr, setImageErr] = useState(false);

  function handleBrokenLink() {
    setImageErr(true);
  }

  if (previewImage && !imageErr) {
    return (
      <ImageContainer>
        <img
          src={previewImage}
          onError={handleBrokenLink}
          alt="current pic preview"
        />
      </ImageContainer>
    );
  }

  if (userImage && !imageErr) {
    return (
      <ImageContainer>
        <img
          src={userImage}
          onError={handleBrokenLink}
          alt="saved profile pic"
        />
      </ImageContainer>
    );
  }

  if (avatarImage && !imageErr) {
    return (
      <ImageContainer>
        <img
          src={avatarImage}
          onError={handleBrokenLink}
          alt="saved avatar pic"
        />
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <FallbackAvatar
        viewBox="165 226 670 740"
        preserveAspectRatio="xMidYMid meet"
      />
    </ImageContainer>
  );
}

const ImageContainer = styled.div`
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
