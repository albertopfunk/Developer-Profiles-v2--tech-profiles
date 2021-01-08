import React from "react";

function UserIcons(props) {
  return (
    <section>
      <p>{props.github}</p>
      <p>{props.twitter}</p>
      <p>{props.linkedin}</p>
      <p>{props.portfolio}</p>
    </section>
  );
}

export default UserIcons;
