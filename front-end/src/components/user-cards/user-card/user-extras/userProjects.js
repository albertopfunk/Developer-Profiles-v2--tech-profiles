import React from "react";

function userProjects(props) {
  return (
    <section>
      <p>{props.projects[0].project_title}</p>
    </section>
  );
}

export default userProjects;
