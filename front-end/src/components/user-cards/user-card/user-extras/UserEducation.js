import React from "react";

function UserEducation(props) {
  return (
    <section>
      <p>{props.education[0].school}</p>
    </section>
  );
}

export default UserEducation;
