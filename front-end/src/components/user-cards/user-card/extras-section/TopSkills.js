import React from "react";

function TopSkills(props) {
  return (
    <div>
      {props.topSkills.map(skill => (
        <p key={skill}>{skill}</p>
      ))}
    </div>
  );
}

export default TopSkills;
