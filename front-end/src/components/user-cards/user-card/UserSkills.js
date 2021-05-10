import React from "react";
import styled from "styled-components";

function UserSkills({ topSkills, additionalSkills, userId }) {
  return (
    <SkillsContainer>
      <section
        aria-labelledby={`profile-${userId}-top-skills-header`}
        className="top-skills"
      >
        <h4 id={`profile-${userId}-top-skills-header`} className="title">
          Top Skills:
        </h4>

        <ul className="skills">
          {topSkills ? (
            <>
              {topSkills
                .split(",")
                .filter((el, i) => i < 5 && el)
                .map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}

              {topSkills.split(",").length > 5 ? (
                <li>Expand for more skills</li>
              ) : null}
            </>
          ) : (
            <li>No Top Skills Listed</li>
          )}
        </ul>
      </section>

      <section
        aria-labelledby={`profile-${userId}-additional-skills-header`}
        className="additional-skills"
      >
        <h4 id={`profile-${userId}-additional-skills-header`} className="title">
          Additional Skills:
        </h4>

        <ul className="skills">
          {additionalSkills ? (
            <>
              {additionalSkills
                .split(",")
                .filter((el, i) => i < 5 && el)
                .map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}

              {additionalSkills.split(",").length > 5 ? (
                <li>Expand for more skills</li>
              ) : null}
            </>
          ) : (
            <li>No Additional Skills Listed</li>
          )}
        </ul>
      </section>
    </SkillsContainer>
  );
}

const SkillsContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 5 / 6;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 20px;

  @media (min-width: 1050px) {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  }

  .skills {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .top-skills {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 20% 1fr;
    grid-gap: 20px;

    .title {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      justify-self: start;
    }

    .skills {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      place-self: start;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
  }

  .additional-skills {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 20% 1fr;
    grid-gap: 20px;

    .title {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      justify-self: start;
    }

    .skills {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      place-self: start;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
  }
`;

export default UserSkills;
