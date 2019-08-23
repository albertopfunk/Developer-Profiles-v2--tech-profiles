import React from "react";

// Test Ideas
// renders certain section, depending on props
// renders 'nothing to show' when noExtras is true
// if no extras is true, that means that ALL sections should have a length of 0

function UserExtras(props) {
  const {
    noExtras,
    topSkills,
    additionalSkills,
    projects,
    education,
    experience,
    interestedLocations
  } = props;

  return (
    <section>
      {noExtras ? <p>Nothing to Show...</p> : null}

      {topSkills && topSkills.length > 0 ? (
        <section className="top-skills">
          {topSkills.map(skill => (
            <p key={skill}>{skill}</p>
          ))}
        </section>
      ) : null}

      {additionalSkills && additionalSkills.length > 0 ? (
        <section className="top-skills">
          {additionalSkills.map(skill => (
            <p key={skill}>{skill}</p>
          ))}
        </section>
      ) : null}

      {projects && projects.length > 0 ? (
        <section className="projects">
          <p>{projects[0].project_title}</p>
        </section>
      ) : null}

      {education && education.length > 0 ? (
        <section className="education">
          <p>{education[0].school}</p>
        </section>
      ) : null}

      {experience && experience.length > 0 ? (
        <section className="experience">
          <p>{experience[0].company_name}</p>
        </section>
      ) : null}

      {interestedLocations && interestedLocations.length > 0 ? (
        <section className="interested-locations">
          <p>{interestedLocations[0]}</p>
        </section>
      ) : null}
    </section>
  );
}

export default UserExtras;
