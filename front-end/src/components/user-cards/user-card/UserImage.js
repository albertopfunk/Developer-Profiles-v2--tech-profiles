import React, { useState } from "react";
import { ReactComponent as DefaultAvatar } from "./defaultAvatar.svg";

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
      <div className="image">
        <img
          src={previewImage}
          onError={handleBrokenLink}
          alt="current pic preview"
        />
      </div>
    )
  }

  if (userImage && !imageErr) {
    return (
      <div className="image">
        <img
          src={userImage}
          onError={handleBrokenLink}
          alt="saved profile pic"
        />
      </div>
    )
  }

  if (avatarImage && !imageErr) {
    return (
      <div className="image">
        <img
          src={avatarImage}
          onError={handleBrokenLink}
          alt="saved avatar pic"
        />
      </div>
    )
  }

  return (
    <div className="image">
      <DefaultAvatar />
    </div>
  );
}

export default UserImage;
