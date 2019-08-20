import React from "react";

function UserIcons(props) {
  return (
    <aside>
      <p>{props.github}</p>
      <p>{props.linkedin}</p>
      <p>{props.portfolio}</p>
    </aside>
  );
}

export default UserIcons;
