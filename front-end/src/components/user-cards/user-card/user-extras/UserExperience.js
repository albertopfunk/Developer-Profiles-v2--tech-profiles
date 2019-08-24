import React from "react";

function UserExperience(props) {
  return (
    <section>
      <p>{props.experience[0].company_name}</p>
    </section>
  );
}

export default UserExperience;
