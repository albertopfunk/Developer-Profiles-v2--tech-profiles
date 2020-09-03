import React from "react";
import { useState } from "react";

// Test Ideas
// renders image or default avatar image

function UserImage(props) {
  const [imageErr, setImageErr] = useState(false);

  function handleBrokenLink() {
    setImageErr(true);
  }

  return (
    <section>
      {/* add figure/figcation to all images */}

      {(props.previewImg || props.image) && !imageErr ? (
        <img
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
          }}
          src={props.previewImg || props.image}
          onError={handleBrokenLink}
          alt={
            props.previewImg
              ? "current profile pic preview"
              : "profile pic"
          }
        />
      ) : (
        <p>Avatar Image</p>
      )}
    </section>
  );
}

export default UserImage;
