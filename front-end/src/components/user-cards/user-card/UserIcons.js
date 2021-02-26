import React from "react";

function UserIcons({ github, twitter, linkedin, portfolio }) {
  return (
    <div className="icons">
      <p>{github}</p>
      <p>{twitter}</p>
      <p>{linkedin}</p>
      <p>{portfolio}</p>
    </div>
  );
}

export default UserIcons;
