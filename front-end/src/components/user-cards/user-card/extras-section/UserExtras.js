import React from "react";
import { PropTypes } from "prop-types";

import TopSkills from "./TopSkills";

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

      {Array.isArray(topSkills) && topSkills.length > 0 ? (
        <TopSkills topSkills={topSkills} />
      ) : null}

      {Array.isArray(additionalSkills) && additionalSkills.length > 0 ? (
        <section className="top-skills">
          {additionalSkills.map(skill => (
            <p key={skill}>{skill}</p>
          ))}
        </section>
      ) : null}

      {Array.isArray(projects) && projects.length > 0 ? (
        <section className="projects">
          <p>{projects[0].project_title}</p>
        </section>
      ) : null}

      {Array.isArray(education) && education.length > 0 ? (
        <section className="education">
          <p>{education[0].school}</p>
        </section>
      ) : null}

      {Array.isArray(experience) && experience.length > 0 ? (
        <section className="experience">
          <p>{experience[0].company_name}</p>
        </section>
      ) : null}

      {Array.isArray(interestedLocations) && interestedLocations.length > 0 ? (
        <section className="interested-locations">
          <p>{interestedLocations[0]}</p>
        </section>
      ) : null}
    </section>
  );
}

UserExtras.propTypes = {
  noExtras: PropTypes.bool,
  topSkills: PropTypes.arrayOf(PropTypes.string),
  additionalSkills: PropTypes.arrayOf(PropTypes.string),
  projects: PropTypes.arrayOf(PropTypes.object),
  education: PropTypes.arrayOf(PropTypes.object),
  experience: PropTypes.arrayOf(PropTypes.object),
  interestedLocations: PropTypes.arrayOf(PropTypes.string)
};

export default UserExtras;
