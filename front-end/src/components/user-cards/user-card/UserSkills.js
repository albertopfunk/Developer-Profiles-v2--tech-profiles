import React from "react";

function UserSkills(props) {
  return (
    <div>
      <div className="top">
        <strong>Top Skills</strong>
        {props.topSkills ? (
          <div>
            {props.topSkills
              .split(",")
              .filter((el, i) => i < 3 && el)
              .map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            <p>Expand for more skills</p>
          </div>
        ) : (
          <p>No Top Skills Listed</p>
        )}
      </div>

      <div className="additional">
        <strong>Additional Skills</strong>
        {props.additionalSkills ? (
          <div>
            {props.additionalSkills
              .split(",")
              .filter((el, i) => i < 3 && el)
              .map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            <p>Expand for more skills</p>
          </div>
        ) : (
          <p>No Top Skills Listed</p>
        )}
      </div>
    </div>
  );
}

export default UserSkills;
