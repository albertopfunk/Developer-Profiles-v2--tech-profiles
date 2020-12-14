import React from "react";

import UserProjects from "./UserProjects";
import UserEducation from "./UserEducation";
import UserExperience from "./UserExperience";

function UserExtras({ userExtras, noExtras }) {
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
    <section>
      <div>
        {topSkills.length > 0 ? (
          <section className="top-skills">
            {topSkills.map((skill) => (
              <p key={skill.name}>{skill.name}</p>
            ))}
          </section>
        ) : null}

        {additionalSkills.length > 0 ? (
          <section className="additional-skills">
            {additionalSkills.map((skill) => (
              <p key={skill.name}>{skill.name}</p>
            ))}
          </section>
        ) : null}

        {projects.length > 0 ? <UserProjects projects={projects} /> : null}

        {education.length > 0 ? <UserEducation education={education} /> : null}

        {experience.length > 0 ? (
          <UserExperience experience={experience} />
        ) : null}

        {locations.length > 0 ? (
          <section className="interested-locations">
            {locations.map((location) => (
              <p key={location.name}>{location.name}</p>
            ))}
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default UserExtras;
