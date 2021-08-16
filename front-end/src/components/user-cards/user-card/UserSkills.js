import React from "react";
import styled from "styled-components";

function UserSkills({ topSkills, additionalSkills, userId }) {
  return (
    <SkillsContainer>
      <section
        aria-labelledby={`profile-${userId}-top-skills-preview-header`}
        className="top-skills"
      >
        <h4
          id={`profile-${userId}-top-skills-preview-header`}
          className="title"
        >
          Top Skills:
        </h4>

        <ul className="skills">
          {topSkills ? (
            <>
              {topSkills
                .split(",")
                .filter((el, i) => i < 5 && el)
                .map((skill) => (
                  <li key={skill} className="skill">
                    {skill}
                  </li>
                ))}

              {topSkills.split(",").length > 5 ? (
                <li className="skill">Expand for more skills</li>
              ) : null}
            </>
          ) : (
            <li>No Top Skills Listed</li>
          )}
        </ul>
      </section>

      <section
        aria-labelledby={`profile-${userId}-additional-skills-previewheader`}
        className="additional-skills"
      >
        <h4
          id={`profile-${userId}-additional-skills-previewheader`}
          className="title"
        >
          Additional Skills:
        </h4>

        <ul className="skills">
          {additionalSkills ? (
            <>
              {additionalSkills
                .split(",")
                .filter((el, i) => i < 5 && el)
                .map((skill) => (
                  <li className="skill" key={skill}>
                    {skill}
                  </li>
                ))}

              {additionalSkills.split(",").length > 5 ? (
                <li className="skill">Expand for more skills</li>
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
  display: flex;
  flex-wrap: wrap;
  gap: 30px;

  @media (min-width: 350px) {
    flex-wrap: nowrap;
    gap: 25px;
  }

  @media (min-width: 950px) {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  }

  .skills {
    .skill {
      border-radius: 10px;
      box-shadow: var(--box-shadow-primary);
      padding: 5px;
    }
  }

  .top-skills {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    @media (min-width: 350px) {
      flex-basis: 50%;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  .additional-skills {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    @media (min-width: 350px) {
      flex-basis: 50%;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
`;

export default UserSkills;
