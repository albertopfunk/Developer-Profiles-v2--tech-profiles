import React from "react";

function UserExtras(props) {
  return (
    <section>
      {props.noExtras ? <p>Nothing to Show...</p> : null}

      {props.topSkills.length > 0 ? (
        <section className="top-skills">
          {props.topSkills.map(skill => (
            <p key={skill}>{skill}</p>
          ))}
        </section>
      ) : null}

      {props.additionalSkills.length > 0 ? (
        <section className="top-skills">
          {props.additionalSkills.map(skill => (
            <p key={skill}>{skill}</p>
          ))}
        </section>
      ) : null}

      {props.projects.length > 0 ? (
        <section className="projects">
          <p>{props.projects[0].project_title}</p>
        </section>
      ) : null}

      {props.education.length > 0 ? (
        <section className="education">
          <p>{props.education[0].school}</p>
        </section>
      ) : null}

      {props.experience.length > 0 ? (
        <section className="experience">
          <p>{props.experience[0].company_name}</p>
        </section>
      ) : null}

      {props.interestedLocations.length > 0 ? (
        <section className="interested-locations">
          <p>{props.interestedLocations[0]}</p>
        </section>
      ) : null}
    </section>
  );
}

export default UserExtras;
