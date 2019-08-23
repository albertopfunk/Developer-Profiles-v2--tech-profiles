import React from "react";

// Test Ideas
// renders image or default avatar image

function UserImage(props) {
  return (
    <section>
      {/* add figure/figcation to all images */}
      {props.image ? (
        <img
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%"
          }}
          src={props.image}
          alt="user-avatar"
        />
      ) : (
        <p>Avatar Image</p>
      )}
    </section>
  );
}

export default UserImage;
