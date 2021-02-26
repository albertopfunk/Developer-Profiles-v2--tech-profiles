import React from "react";

function UserSkills({topSkills, additionalSkills}) {
  return (
    <div className="skills">
      <div className="top">
        <strong>Top Skills</strong>
        {topSkills ? (
          <div>
            {topSkills
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
        {additionalSkills ? (
          <div>
            {additionalSkills
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
