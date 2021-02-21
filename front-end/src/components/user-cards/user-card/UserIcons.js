import React from "react";

function UserIcons({ github, twitter, linkedin, portfolio }) {
  return (
    <section>
      <p>{github}</p>
      <p>{twitter}</p>
      <p>{linkedin}</p>
      <p>{portfolio}</p>
    </section>
  );
}

export default UserIcons;
