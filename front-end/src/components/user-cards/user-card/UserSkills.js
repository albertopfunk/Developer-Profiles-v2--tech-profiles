import React from "react";
import styled from "styled-components";

function UserSkills({topSkills, additionalSkills}) {
  return (
    <SkillsContainer className="skills">
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
          <p>No Additional Skills Listed</p>
        )}
      </div>
    </SkillsContainer>
  );
}

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  @media (min-width: 1100px) {
    flex-direction: row;
  }
`;

export default UserSkills;
