import React from "react";

// Test Ideas
// renders with icons or with replacement UI if none exist
// maybe have a default icon that always shows => share profile icon

function UserIcons(props) {
  return (
    <aside>
      <p>{props.github}</p>
      <p>{props.twitter}</p>
      <p>{props.linkedin}</p>
      <p>{props.portfolio}</p>
    </aside>
  );
}

export default UserIcons;
