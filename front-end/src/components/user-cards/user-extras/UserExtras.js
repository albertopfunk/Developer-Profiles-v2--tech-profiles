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
        <ProjectsSection aria-labelledby={`profile-${userId}-projects-header`}>
          <h4 id={`profile-${userId}-projects-header`} className="title">
            Projects:
          </h4>

          <dl className="list">
            {projects.map((project) => (
              <div key={project.id} className="item">
                <dt>{project.project_title}</dt>
                <dd>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="image-link"
                  >
                    <img src={project.project_img} alt="" width="100%" />
                    {project.link}
                    <span className="sr-only">(opens in new window)</span>
                  </a>
                </dd>
                <dd></dd>
                <dd className="description">{project.project_description}</dd>
              </div>
            ))}
          </dl>
        </ProjectsSection>
      ) : null}

      {education.length > 0 ? (
        <EducationSection
          aria-labelledby={`profile-${userId}-education-header`}
        >
          <h4 id={`profile-${userId}-education-header`} className="title">
            Education:
          </h4>

          <dl className="list">
            {education.map((education) => (
              <div key={education.id} className="item">
                <dt>{education.school}</dt>
                <dd>{education.school_dates}</dd>
                <dd>{education.field_of_study}</dd>
                <dd className="description">
                  {education.education_description}
                </dd>
              </div>
            ))}
          </dl>
        </EducationSection>
      ) : null}

      {experience.length > 0 ? (
        <ExperienceSection
          aria-labelledby={`profile-${userId}-experience-header`}
        >
          <h4 id={`profile-${userId}-experience-header`} className="title">
            Experience:
          </h4>

          <dl className="list">
            {experience.map((experience) => (
              <div key={experience.id} className="item">
                <dt>{experience.company_name}</dt>
                <dd>{experience.job_dates}</dd>
                <dd>{experience.job_title}</dd>
                <dd className="description">{experience.job_description}</dd>
              </div>
            ))}
          </dl>
        </ExperienceSection>
      ) : null}

      {topSkills.length > 0 ? (
        <TopSkillsSection
          aria-labelledby={`profile-${userId}-top-skills-header`}
        >
          <h4 id={`profile-${userId}-top-skills-header`} className="title">
            Top Skills:
          </h4>

          <ul className="list">
            {topSkills.map((skill) => (
              <li className="item" key={skill.name}>
                {skill.name}
              </li>
            ))}
          </ul>
        </TopSkillsSection>
      ) : null}

      {additionalSkills.length > 0 ? (
        <AdditionalSkillsSection
          aria-labelledby={`profile-${userId}-additional-skills-header`}
        >
          <h4
            id={`profile-${userId}-additional-skills-header`}
            className="title"
          >
            Additional Skills:
          </h4>

          <ul className="list">
            {additionalSkills.map((skill) => (
              <li className="item" key={skill.name}>
                {skill.name}
              </li>
            ))}
          </ul>
        </AdditionalSkillsSection>
      ) : null}

      {locations.length > 0 ? (
        <InterestedLocationsSection
          aria-labelledby={`profile-${userId}-interested-locations-header`}
        >
          <h4
            id={`profile-${userId}-interested-locations-header`}
            className="title"
          >
            Interested Locations:
          </h4>

          <ul className="list">
            {locations.map((location) => (
              <li className="item" key={location.name}>
                {location.name}
              </li>
            ))}
          </ul>
        </InterestedLocationsSection>
      ) : null}
    </ExtrasContainer>
  );
}

const ExtrasContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, auto);
  grid-gap: 40px;

  section {
    display: flex;
    flex-direction: column;
    gap: 5px;

    ul.list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .item {
        border-radius: 10px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
          rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        padding: 5px;
      }
    }

    dl.list {
      overflow-x: auto;
      display: flex;
      gap: 20px;
      padding: 15px;

      .item {
        flex-shrink: 0;
        flex-basis: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 10px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
          rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        padding: 5px;

        .image-link {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;

          .sr-only {
            position: relative;
          }
        }

        .description {
          text-align: center;
        }
      }
    }
  }
`;

const ProjectsSection = styled.section`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`;

const EducationSection = styled.section`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
`;

const ExperienceSection = styled.section`
  grid-column: 1 / 2;
  grid-row: 3 / 4;
`;

const TopSkillsSection = styled.section`
  grid-column: 1 / 2;
  grid-row: 4 / 5;
`;

const AdditionalSkillsSection = styled.section`
  grid-column: 1 / 2;
  grid-row: 5 / 6;
`;

const InterestedLocationsSection = styled.section`
  grid-column: 1 / 2;
  grid-row: 6 / 7;
`;

export default UserExtras;
