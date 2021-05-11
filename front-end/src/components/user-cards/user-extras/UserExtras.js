import React from "react";
import styled from "styled-components";

function UserExtras({ userExtras, noExtras, userId }) {
  if (noExtras) {
    return <p>Nothing to Show...</p>;
  }

  const {
    topSkills,
    additionalSkills,
    projects,
    education,
    experience,
    locations,
  } = userExtras;

  return (
    <ExtrasContainer>
      {projects.length > 0 ? (
        <section aria-labelledby={`profile-${userId}-projects-header`}>
          <h4 id={`profile-${userId}-projects-header`}>Projects:</h4>

          <dl>
            {projects.map((project) => {
              <div>
                <dt>{project.project_title}</dt>
                <dd>{project.project_img}</dd>
                <dd>{project.project_description}</dd>
                <dd>{project.link}</dd>
              </div>;
            })}
          </dl>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section aria-labelledby={`profile-${userId}-education-header`}>
          <h4 id={`profile-${userId}-education-header`}>Education:</h4>

          <dl>
            {education.map((education) => {
              <div>
                <dt>{education.school}</dt>
                <dd>{education.field_of_study}</dd>
                <dd>{education.school_dates}</dd>
                <dd>{education.education_description}</dd>
              </div>;
            })}
          </dl>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section aria-labelledby={`profile-${userId}-experience-header`}>
          <h4 id={`profile-${userId}-experience-header`}>Experience:</h4>

          <dl>
            {experience.map((experience) => {
              <div>
                <dt>{experience.company_name}</dt>
                <dd>{experience.job_title}</dd>
                <dd>{experience.job_dates}</dd>
                <dd>{experience.job_description}</dd>
              </div>;
            })}
          </dl>
        </section>
      ) : null}

      {topSkills.length > 0 ? (
        <section aria-labelledby={`profile-${userId}-top-skills-header`}>
          <h4 id={`profile-${userId}-top-skills-header`}>Top Skills:</h4>

          <ul>
            {topSkills.map((skill) => (
              <li key={skill.name}>{skill.name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {additionalSkills.length > 0 ? (
        <section aria-labelledby={`profile-${userId}-additional-skills-header`}>
          <h4 id={`profile-${userId}-additional-skills-header`}>
            Additional Skills:
          </h4>

          <ul>
            {additionalSkills.map((skill) => (
              <li key={skill.name}>{skill.name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {locations.length > 0 ? (
        <section
          aria-labelledby={`profile-${userId}-interested-locations-header`}
        >
          <h4 id={`profile-${userId}-interested-locations-header`}>
            Interested Locations:
          </h4>

          <ul>
            {locations.map((location) => (
              <li key={location.name}>{location.name}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </ExtrasContainer>
  );
}

const ExtrasContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, auto);
`;

export default UserExtras;
