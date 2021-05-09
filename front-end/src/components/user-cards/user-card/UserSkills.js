import React from "react";
import styled from "styled-components";

function UserSkills({ topSkills, additionalSkills }) {
  return (
    <SkillsContainer>
      <div className="top-title">
        <strong>Top Skills:</strong>
      </div>

      <div className="top-skills">
        {topSkills ? (
          <>
            {topSkills
              .split(",")
              .filter((el, i) => i < 5 && el)
              .map((skill) => (
                <p key={skill}>{skill}</p>
              ))}

            {topSkills.split(",").length > 5 ? <p>Expand for more skills</p> : null}
          </>
        ) : (
          <p>No Top Skills Listed</p>
        )}
      </div>

      <div className="additional-title">
        <strong>Additional Skills:</strong>
      </div>

      <div className="additional-skills">
        {additionalSkills ? (
          <>
            {additionalSkills
              .split(",")
              .filter((el, i) => i < 5 && el)
              .map((skill) => (
                <p key={skill}>{skill}</p>
              ))}

            {additionalSkills.split(",").length > 5 ? <p>Expand for more skills</p> : null}
          </>
        ) : (
          <p>No Additional Skills Listed</p>
        )}
      </div>
    </SkillsContainer>
  );
}

const SkillsContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 5 / 6;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 20% 1fr;
  grid-gap: 20px;

  .top-title {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    justify-self: start;
  }

  .top-skills {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    place-self: center;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .additional-title {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    justify-self: start;
  }

  .additional-skills {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    place-self: center;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
`;

export default UserSkills;
