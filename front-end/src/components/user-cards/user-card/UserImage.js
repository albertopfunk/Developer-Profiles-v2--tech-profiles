import React, { useState } from "react";

// Test Ideas
// renders image or default avatar image

function UserImage({image, previewImg}) {
  const [imageErr, setImageErr] = useState(false);

  function handleBrokenLink() {
    setImageErr(true);
  }

  // decorative
  return (
    <div className="image">
      {/* add figure/figcation to all images */}

      {(previewImg || image) && !imageErr ? (
        <img
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
          }}
          src={previewImg || image}
          onError={handleBrokenLink}
          alt={previewImg ? "current profile pic preview" : "profile pic"}
        />
      ) : (
        <p>Avatar Image</p>
      )}
    </div>
  );
}

export default UserImage;
